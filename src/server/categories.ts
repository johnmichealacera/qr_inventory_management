"use server";

import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/audit";
import { requireRole } from "@/lib/auth";
import { categorySchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function getCategories() {
  return db.category.findMany({
    include: { _count: { select: { items: true } } },
    orderBy: { name: "asc" },
  });
}

export async function createCategory(data: unknown) {
  const session = await requireRole(["Admin", "Staff"]);
  const parsed = categorySchema.parse(data);

  const existing = await db.category.findUnique({
    where: { name: parsed.name },
  });
  if (existing) throw new Error("Category already exists");

  const category = await db.category.create({ data: parsed });

  await createAuditLog({
    userId: session.user.id,
    action: "CREATE_CATEGORY",
    entity: "Category",
    entityId: category.id,
    details: `Created category: ${category.name}`,
  });

  revalidatePath("/categories");
  revalidatePath("/inventory");
  return category;
}

export async function updateCategory(id: string, data: unknown) {
  const session = await requireRole(["Admin", "Staff"]);
  const parsed = categorySchema.parse(data);

  const category = await db.category.update({
    where: { id },
    data: parsed,
  });

  await createAuditLog({
    userId: session.user.id,
    action: "UPDATE_CATEGORY",
    entity: "Category",
    entityId: category.id,
    details: `Updated category: ${category.name}`,
  });

  revalidatePath("/categories");
  revalidatePath("/inventory");
  return category;
}

export async function deleteCategory(id: string) {
  const session = await requireRole(["Admin"]);

  const category = await db.category.findUnique({
    where: { id },
    include: { _count: { select: { items: true } } },
  });
  if (!category) throw new Error("Category not found");
  if (category._count.items > 0) {
    throw new Error("Cannot delete category with existing items");
  }

  await db.category.delete({ where: { id } });

  await createAuditLog({
    userId: session.user.id,
    action: "DELETE_CATEGORY",
    entity: "Category",
    entityId: id,
    details: `Deleted category: ${category.name}`,
  });

  revalidatePath("/categories");
}
