"use server";

import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/audit";
import { requireRole } from "@/lib/auth";
import { createBorrowerSchema, updateBorrowerSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function getBorrowers(search?: string) {
  await requireRole(["Admin", "Custodian", "Auditor"]);
  const where: Record<string, unknown> = {};
  if (search?.trim()) {
    where.OR = [
      { fullName: { contains: search, mode: "insensitive" } },
      { studentId: { contains: search, mode: "insensitive" } },
    ];
  }
  return db.borrower.findMany({
    where,
    orderBy: { fullName: "asc" },
  });
}

export async function getBorrowerById(id: string) {
  return db.borrower.findUnique({ where: { id } });
}

export async function createBorrower(data: unknown) {
  const session = await requireRole(["Admin", "Custodian"]);
  const parsed = createBorrowerSchema.parse(data);

  const existing = await db.borrower.findUnique({
    where: { studentId: parsed.studentId.trim() },
  });
  if (existing) throw new Error("Student ID already registered");

  const borrower = await db.borrower.create({
    data: {
      fullName: parsed.fullName.trim(),
      studentId: parsed.studentId.trim(),
      programSection: parsed.programSection?.trim() || null,
      contactPhone: parsed.contactPhone?.trim() || null,
    },
  });

  await createAuditLog({
    userId: session.user.id,
    action: "CREATE_BORROWER",
    entity: "Borrower",
    entityId: borrower.id,
    details: `Registered borrower: ${borrower.fullName} (${borrower.studentId})`,
  });

  revalidatePath("/borrowers");
  revalidatePath("/transactions");
  revalidatePath("/scan");
  return borrower;
}

export async function updateBorrower(id: string, data: unknown) {
  const session = await requireRole(["Admin", "Custodian"]);
  const parsed = updateBorrowerSchema.parse(data);

  if (parsed.studentId) {
    const dup = await db.borrower.findFirst({
      where: { studentId: parsed.studentId.trim(), NOT: { id } },
    });
    if (dup) throw new Error("Student ID already in use");
  }

  const updateData: Record<string, string | null> = {};
  if (parsed.fullName !== undefined) updateData.fullName = parsed.fullName.trim();
  if (parsed.studentId !== undefined) updateData.studentId = parsed.studentId.trim();
  if (parsed.programSection !== undefined) {
    updateData.programSection = parsed.programSection?.trim() || null;
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
    details: `Updated borrower: ${borrower.fullName}`,
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
  if (!borrower) throw new Error("Borrower not found");
  if (borrower._count.transactions > 0) {
    throw new Error("Cannot delete borrower with transaction history");
  }

  await db.borrower.delete({ where: { id } });

  await createAuditLog({
    userId: session.user.id,
    action: "DELETE_BORROWER",
    entity: "Borrower",
    entityId: id,
    details: `Deleted borrower: ${borrower.fullName}`,
  });

  revalidatePath("/borrowers");
}
