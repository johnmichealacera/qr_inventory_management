"use server";

import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/audit";
import { requireRole } from "@/lib/auth";
import { createBorrowerSchema, updateBorrowerSchema } from "@/lib/validations";
import { PAGE_SIZE } from "@/lib/constants";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@/generated/prisma/client";

function borrowerSearchWhere(search?: string) {
  const where: Record<string, unknown> = {};
  const q = search?.trim();
  if (q) {
    where.OR = [
      { fullName: { contains: q, mode: "insensitive" } },
      { idNumber: { contains: q, mode: "insensitive" } },
      { department: { contains: q, mode: "insensitive" } },
      { officeUnit: { contains: q, mode: "insensitive" } },
    ];
  }
  return where;
}

export async function getBorrowers(search?: string) {
  await requireRole(["Admin", "Custodian", "Auditor"]);
  return db.borrower.findMany({
    where: borrowerSearchWhere(search),
    orderBy: [{ department: "asc" }, { fullName: "asc" }],
  });
}

export async function getBorrowersPaginated(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  await requireRole(["Admin", "Custodian"]);

  const page = params?.page ?? 1;
  const limit = params?.limit ?? PAGE_SIZE;
  const skip = (page - 1) * limit;
  const where = borrowerSearchWhere(params?.search);

  const [borrowers, total] = await Promise.all([
    db.borrower.findMany({
      where,
      orderBy: [{ department: "asc" }, { fullName: "asc" }],
      skip,
      take: limit,
    }),
    db.borrower.count({ where }),
  ]);

  return {
    borrowers,
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getBorrowerById(id: string) {
  return db.borrower.findUnique({ where: { id } });
}

export async function createBorrower(data: unknown) {
  const session = await requireRole(["Admin", "Custodian"]);
  const parsed = createBorrowerSchema.parse(data);

  const existing = await db.borrower.findUnique({
    where: { idNumber: parsed.idNumber.trim() },
  });
  if (existing) throw new Error("This ID number is already registered");

  const borrower = await db.borrower.create({
    data: {
      fullName: parsed.fullName.trim(),
      idNumber: parsed.idNumber.trim(),
      personType: parsed.personType,
      department: parsed.department.trim(),
      officeUnit: parsed.officeUnit?.trim() || null,
      contactPhone: parsed.contactPhone?.trim() || null,
    },
  });

  await createAuditLog({
    userId: session.user.id,
    action: "CREATE_BORROWER",
    entity: "Borrower",
    entityId: borrower.id,
    details: `Registered requester: ${borrower.fullName} (${borrower.idNumber})`,
  });

  revalidatePath("/borrowers");
  revalidatePath("/transactions");
  revalidatePath("/scan");
  revalidatePath("/consumables");
  return borrower;
}

export async function updateBorrower(id: string, data: unknown) {
  const session = await requireRole(["Admin", "Custodian"]);
  const parsed = updateBorrowerSchema.parse(data);

  if (parsed.idNumber) {
    const dup = await db.borrower.findFirst({
      where: { idNumber: parsed.idNumber.trim(), NOT: { id } },
    });
    if (dup) throw new Error("This ID number is already in use");
  }

  const updateData: Prisma.BorrowerUpdateInput = {};
  if (parsed.fullName !== undefined) updateData.fullName = parsed.fullName.trim();
  if (parsed.idNumber !== undefined) updateData.idNumber = parsed.idNumber.trim();
  if (parsed.personType !== undefined) updateData.personType = parsed.personType;
  if (parsed.department !== undefined) updateData.department = parsed.department.trim();
  if (parsed.officeUnit !== undefined) {
    updateData.officeUnit = parsed.officeUnit?.trim() || null;
  }
  if (parsed.contactPhone !== undefined) {
    updateData.contactPhone = parsed.contactPhone?.trim() || null;
  }

  if (Object.keys(updateData).length === 0) {
    throw new Error("No fields to update");
  }

  const borrower = await db.borrower.update({
    where: { id },
    data: updateData,
  });

  await createAuditLog({
    userId: session.user.id,
    action: "UPDATE_BORROWER",
    entity: "Borrower",
    entityId: borrower.id,
    details: `Updated requester: ${borrower.fullName}`,
  });

  revalidatePath("/borrowers");
  return borrower;
}

export async function deleteBorrower(id: string) {
  const session = await requireRole(["Admin"]);

  const borrower = await db.borrower.findUnique({
    where: { id },
    include: { _count: { select: { transactions: true } } },
  });
  if (!borrower) throw new Error("Requester not found");
  if (borrower._count.transactions > 0) {
    throw new Error("Cannot delete requester with transaction history");
  }

  await db.borrower.delete({ where: { id } });

  await createAuditLog({
    userId: session.user.id,
    action: "DELETE_BORROWER",
    entity: "Borrower",
    entityId: id,
    details: `Deleted requester: ${borrower.fullName}`,
  });

  revalidatePath("/borrowers");
}
