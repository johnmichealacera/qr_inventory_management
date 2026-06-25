"use server";

import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/audit";
import { requireAuth, requireRole } from "@/lib/auth";
import {
  CONSUMABLE_REQUEST_TRANSITIONS,
  INVENTORY_TYPES,
  type ConsumableRequestStatusName,
} from "@/lib/constants";
import {
  canReviewConsumableRequests,
  canSubmitConsumableRequest,
  isRequesterRole,
} from "@/lib/roles";
import {
  createConsumableRequestSchema,
  reviewConsumableRequestSchema,
} from "@/lib/validations";
import { revalidatePath } from "next/cache";

const requestInclude = {
  user: { select: { id: true, name: true, username: true } },
  borrower: true,
  item: { select: { id: true, name: true, inventoryType: true } },
  reviewedBy: { select: { id: true, name: true } },
} as const;

async function generateRequestNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
  const count = await db.consumableRequest.count({
    where: { createdAt: { gte: startOfYear } },
  });
  return `PR-${year}-${String(count + 1).padStart(4, "0")}`;
}

async function getRequesterBorrowerId(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { borrowerId: true, role: { select: { name: true } } },
  });
  if (!user || !isRequesterRole(user.role.name)) {
    throw new Error("Forbidden");
  }
  if (!user.borrowerId) {
    throw new Error(
      "Your account is not linked to a requester profile. Contact the administrator."
    );
  }
  return user.borrowerId;
}

export async function getMyConsumableRequests() {
  const session = await requireAuth();
  if (!canSubmitConsumableRequest(session.user.role)) {
    throw new Error("Forbidden");
  }

  return db.consumableRequest.findMany({
    where: { userId: session.user.id },
    include: requestInclude,
    orderBy: { createdAt: "desc" },
  });
}

export async function getConsumableRequestById(id: string) {
  const session = await requireAuth();
  const request = await db.consumableRequest.findUnique({
    where: { id },
    include: requestInclude,
  });
  if (!request) return null;

  const canReview = canReviewConsumableRequests(session.user.role);
  const isOwner = request.userId === session.user.id;
  if (!canReview && !isOwner) {
    throw new Error("Forbidden");
  }

  return request;
}

export async function getConsumableRequestsForReview(status?: string) {
  const session = await requireAuth();
  if (!canReviewConsumableRequests(session.user.role)) {
    throw new Error("Forbidden");
  }

  return db.consumableRequest.findMany({
    where: status
      ? {
          status: status as ConsumableRequestStatusName,
        }
      : undefined,
    include: requestInclude,
    orderBy: { createdAt: "desc" },
  });
}

export async function getMyRequestStats() {
  const session = await requireAuth();
  if (!canSubmitConsumableRequest(session.user.role)) {
    return { pending: 0, approved: 0, fulfilled: 0, rejected: 0, total: 0 };
  }

  const [pending, approved, fulfilled, rejected] = await Promise.all([
    db.consumableRequest.count({
      where: {
        userId: session.user.id,
        status: { in: ["PENDING", "CANVASSING", "FOR_VOUCHER"] },
      },
    }),
    db.consumableRequest.count({
      where: { userId: session.user.id, status: "APPROVED" },
    }),
    db.consumableRequest.count({
      where: { userId: session.user.id, status: "FULFILLED" },
    }),
    db.consumableRequest.count({
      where: { userId: session.user.id, status: "REJECTED" },
    }),
  ]);

  return {
    pending,
    approved,
    fulfilled,
    rejected,
    total: pending + approved + fulfilled + rejected,
  };
}

export async function getPendingRequestCountForReview() {
  const session = await requireAuth();
  if (!canReviewConsumableRequests(session.user.role)) return 0;

  return db.consumableRequest.count({
    where: { status: { in: ["PENDING", "CANVASSING", "FOR_VOUCHER"] } },
  });
}

export async function createConsumableRequest(data: unknown) {
  const session = await requireAuth();
  if (!canSubmitConsumableRequest(session.user.role)) {
    throw new Error("Forbidden");
  }

  const parsed = createConsumableRequestSchema.parse(data);
  const borrowerId = await getRequesterBorrowerId(session.user.id);

  if (parsed.itemId) {
    const item = await db.item.findUnique({ where: { id: parsed.itemId } });
    if (!item || item.inventoryType !== INVENTORY_TYPES.CONSUMABLE) {
      throw new Error("Invalid consumable item");
    }
  }

  const requestNumber = await generateRequestNumber();

  const request = await db.consumableRequest.create({
    data: {
      requestNumber,
      userId: session.user.id,
      borrowerId,
      itemId: parsed.itemId?.trim() || null,
      customItemName: parsed.customItemName?.trim() || null,
      customDescription: parsed.customDescription?.trim() || null,
      quantity: parsed.quantity,
      notes: parsed.notes?.trim() || null,
    },
    include: requestInclude,
  });

  const label = request.item?.name ?? request.customItemName ?? "Custom item";

  await createAuditLog({
    userId: session.user.id,
    action: "CREATE_CONSUMABLE_REQUEST",
    entity: "ConsumableRequest",
    entityId: request.id,
    details: `${requestNumber}: requested ${parsed.quantity}× ${label}`,
  });

  revalidatePath("/my-requests");
  revalidatePath("/consumables");
  revalidatePath("/consumable-requests");
  revalidatePath("/dashboard");

  return request;
}

export async function reviewConsumableRequest(id: string, data: unknown) {
  const session = await requireAuth();
  if (!canReviewConsumableRequests(session.user.role)) {
    throw new Error("Forbidden");
  }

  const parsed = reviewConsumableRequestSchema.parse(data);

  const existing = await db.consumableRequest.findUnique({ where: { id } });
  if (!existing) throw new Error("Request not found");

  const currentStatus = existing.status as ConsumableRequestStatusName;
  const allowed = CONSUMABLE_REQUEST_TRANSITIONS[currentStatus] ?? [];
  if (!allowed.includes(parsed.status as ConsumableRequestStatusName)) {
    throw new Error(
      `Cannot move from ${currentStatus} to ${parsed.status}. Allowed: ${allowed.join(", ") || "none"}`
    );
  }

  const request = await db.consumableRequest.update({
    where: { id },
    data: {
      status: parsed.status,
      reviewNotes: parsed.reviewNotes?.trim() || null,
      reviewedById: session.user.id,
      reviewedAt: new Date(),
    },
    include: requestInclude,
  });

  await createAuditLog({
    userId: session.user.id,
    action: `CONSUMABLE_REQUEST_${parsed.status}`,
    entity: "ConsumableRequest",
    entityId: request.id,
    details: `${request.requestNumber} → ${parsed.status}`,
  });

  revalidatePath("/consumable-requests");
  revalidatePath("/my-requests");
  revalidatePath("/dashboard");
  revalidatePath(`/purchase-request/${id}`);

  return request;
}

export async function getUserBorrowerProfile() {
  const session = await requireAuth();
  if (!isRequesterRole(session.user.role)) return null;

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { borrower: true },
  });

  return user?.borrower ?? null;
}
