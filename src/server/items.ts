"use server";

import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/audit";
import { requireAuth, requireRole } from "@/lib/auth";
import { createItemSchema, updateItemSchema } from "@/lib/validations";
import { EQUIPMENT_PROGRAM_CRIMINOLOGY } from "@/lib/constants";
import { revalidatePath } from "next/cache";
import QRCode from "qrcode";

export async function getItems(search?: string, categoryId?: string) {
  const where: Record<string, unknown> = {
    equipmentProgram: EQUIPMENT_PROGRAM_CRIMINOLOGY,
  };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  return db.item.findMany({
    where,
    include: {
      category: true,
      qrCode: true,
      _count: { select: { transactions: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getItemById(id: string) {
  return db.item.findUnique({
    where: { id },
    include: {
      category: true,
      qrCode: true,
      transactions: {
        include: {
          user: { select: { id: true, name: true } },
          borrower: { select: { id: true, fullName: true, studentId: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });
}

export async function getItemStock(itemId: string): Promise<number> {
  const result = await db.transaction.groupBy({
    by: ["type"],
    where: { itemId },
    _sum: { quantity: true },
  });

  let stock = 0;
  for (const row of result) {
    const qty = row._sum.quantity ?? 0;
    if (row.type === "IN" || row.type === "RETURN") {
      stock += qty;
    } else if (row.type === "OUT") {
      stock -= qty;
    }
  }
  return Math.max(0, stock);
}

export async function createItem(data: unknown) {
  const session = await requireRole(["Admin", "Custodian"]);
  const parsed = createItemSchema.parse(data);

  const item = await db.item.create({
    data: {
      name: parsed.name,
      description: parsed.description,
      categoryId: parsed.categoryId,
      reorderLevel: parsed.reorderLevel,
      equipmentProgram: EQUIPMENT_PROGRAM_CRIMINOLOGY,
    },
  });

  const qrValue = `INV-${item.id}`;
  await db.qRCode.create({
    data: {
      itemId: item.id,
      value: qrValue,
    },
  });

  await createAuditLog({
    userId: session.user.id,
    action: "CREATE_ITEM",
    entity: "Item",
    entityId: item.id,
    details: `Created item: ${item.name}`,
  });

  revalidatePath("/dashboard");
  revalidatePath("/inventory");
  return item;
}

export async function updateItem(id: string, data: unknown) {
  const session = await requireRole(["Admin", "Custodian"]);
  const parsed = updateItemSchema.parse(data);

  const item = await db.item.update({
    where: { id },
    data: { ...parsed, equipmentProgram: EQUIPMENT_PROGRAM_CRIMINOLOGY },
  });

  await createAuditLog({
    userId: session.user.id,
    action: "UPDATE_ITEM",
    entity: "Item",
    entityId: item.id,
    details: `Updated item: ${item.name}`,
  });

  revalidatePath("/dashboard");
  revalidatePath("/inventory");
  revalidatePath(`/inventory/${id}`);
  return item;
}

export async function deleteItem(id: string) {
  const session = await requireRole(["Admin"]);

  const item = await db.item.findUnique({ where: { id } });
  if (!item) throw new Error("Item not found");

  await db.item.delete({ where: { id } });

  await createAuditLog({
    userId: session.user.id,
    action: "DELETE_ITEM",
    entity: "Item",
    entityId: id,
    details: `Deleted item: ${item.name}`,
  });

  revalidatePath("/dashboard");
  revalidatePath("/inventory");
}

export async function getItemByQRValue(qrValue: string) {
  const qrCode = await db.qRCode.findUnique({
    where: { value: qrValue },
    include: {
      item: {
        include: { category: true },
      },
    },
  });

  if (!qrCode) return null;
  if (qrCode.item.equipmentProgram !== EQUIPMENT_PROGRAM_CRIMINOLOGY) return null;

  const stock = await getItemStock(qrCode.itemId);
  return { ...qrCode.item, currentStock: stock };
}

export async function generateQRCodeDataURL(value: string): Promise<string> {
  return QRCode.toDataURL(value, {
    width: 300,
    margin: 2,
    color: { dark: "#000000", light: "#ffffff" },
  });
}
