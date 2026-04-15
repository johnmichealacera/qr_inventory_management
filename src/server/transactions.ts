"use server";

import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/audit";
import { requireAuth, requireRole } from "@/lib/auth";
import { transactionSchema } from "@/lib/validations";
import { getItemStock } from "@/server/items";
import { revalidatePath } from "next/cache";

export async function createTransaction(data: unknown) {
  const session = await requireRole(["Admin", "Custodian"]);
  const parsed = transactionSchema.parse(data);

  const item = await db.item.findUnique({ where: { id: parsed.itemId } });
  if (!item) throw new Error("Item not found");

  if (parsed.type === "OUT" || parsed.type === "RETURN") {
    if (!parsed.borrowerId?.trim()) {
      throw new Error("Borrower (student) is required for issuance and return");
    }
    const borrower = await db.borrower.findUnique({
      where: { id: parsed.borrowerId.trim() },
    });
    if (!borrower) throw new Error("Borrower not found");
  }

  if (parsed.type === "OUT") {
    const currentStock = await getItemStock(parsed.itemId);
    if (currentStock < parsed.quantity) {
      throw new Error(`Insufficient stock. Current: ${currentStock}, Requested: ${parsed.quantity}`);
    }
  }

  const transaction = await db.transaction.create({
    data: {
      itemId: parsed.itemId,
      userId: session.user.id,
      type: parsed.type,
      quantity: parsed.quantity,
      notes: parsed.notes,
      borrowerId:
        parsed.type === "IN" ? null : parsed.borrowerId?.trim() ?? null,
    },
    include: {
      item: true,
      user: { select: { id: true, name: true } },
      borrower: { select: { id: true, fullName: true, studentId: true } },
    },
  });

  await createAuditLog({
    userId: session.user.id,
    action: `TRANSACTION_${parsed.type}`,
    entity: "Transaction",
    entityId: transaction.id,
    details: `${parsed.type} ${parsed.quantity} of ${item.name}${transaction.borrower ? ` → ${transaction.borrower.fullName}` : ""}`,
  });

  revalidatePath("/dashboard");
  revalidatePath("/inventory");
  revalidatePath("/transactions");
  revalidatePath("/reports");
  return transaction;
}

export async function getTransactions(params?: {
  page?: number;
  limit?: number;
  itemId?: string;
  type?: string;
  borrowerId?: string;
  startDate?: string;
  endDate?: string;
}) {
  await requireRole(["Admin", "Custodian", "Auditor"]);

  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (params?.itemId) where.itemId = params.itemId;
  if (params?.type) where.type = params.type;
  if (params?.borrowerId) where.borrowerId = params.borrowerId;

  if (params?.startDate || params?.endDate) {
    const createdAt: Record<string, Date> = {};
    if (params.startDate) createdAt.gte = new Date(params.startDate);
    if (params.endDate) {
      const end = new Date(params.endDate);
      end.setHours(23, 59, 59, 999);
      createdAt.lte = end;
    }
    where.createdAt = createdAt;
  }

  const [transactions, total] = await Promise.all([
    db.transaction.findMany({
      where,
      include: {
        item: { select: { id: true, name: true } },
        user: { select: { id: true, name: true } },
        borrower: { select: { id: true, fullName: true, studentId: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    db.transaction.count({ where }),
  ]);

  return {
    transactions,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getRecentTransactions(limit = 5) {
  return db.transaction.findMany({
    include: {
      item: { select: { id: true, name: true } },
      user: { select: { id: true, name: true } },
      borrower: { select: { id: true, fullName: true, studentId: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
