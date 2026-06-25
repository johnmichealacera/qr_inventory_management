"use server";

import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/audit";
import { requireAuth, requireRole } from "@/lib/auth";
import { INVENTORY_TYPES } from "@/lib/constants";
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

export async function getConsumableRequestsForReview(status?: string) {
  const session = await requireAuth();
  if (!canReviewConsumableRequests(session.user.role)) {
    throw new Error("Forbidden");
  }

  return db.consumableRequest.findMany({
    where: status ? { status: status as "PENDING" | "APPROVED" | "REJECTED" | "FULFILLED" } : undefined,
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
      where: { userId: session.user.id, status: "PENDING" },
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

  return db.consumableRequest.count({ where: { status: "PENDING" } });
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

  const request = await db.consumableRequest.create({
    data: {
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
    details: `Requested ${parsed.quantity}× ${label}`,
  });

  revalidatePath("/my-requests");
  revalidatePath("/consumables");
  revalidatePath("/consumable-requests");
  revalidatePath("/dashboard");

  return request;
}

export async function reviewConsumableRequest(id: string, data: unknown) {
  const session = await requireRole(["Admin", "Custodian"]);
  const parsed = reviewConsumableRequestSchema.parse(data);

  const existing = await db.consumableRequest.findUnique({ where: { id } });
  if (!existing) throw new Error("Request not found");

  if (parsed.status === "FULFILLED" && existing.status !== "APPROVED") {
    throw new Error("Only approved requests can be marked fulfilled");
  }

  if (
    (parsed.status === "APPROVED" || parsed.status === "REJECTED") &&
    existing.status !== "PENDING"
  ) {
    throw new Error("Only pending requests can be approved or rejected");
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
    details: `${parsed.status} request from ${request.user.name}`,
  });

  revalidatePath("/consumable-requests");
  revalidatePath("/my-requests");
  revalidatePath("/dashboard");

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
