"use server";

import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/audit";
import { requireRole } from "@/lib/auth";
import { createItemSchema, updateItemSchema } from "@/lib/validations";
import { EQUIPMENT_PROGRAM_CRIMINOLOGY, INVENTORY_TYPES } from "@/lib/constants";
import type { InventoryTypeName } from "@/lib/constants";
import { revalidatePath } from "next/cache";
import QRCode from "qrcode";

export async function getItems(
  search?: string,
  categoryId?: string,
  inventoryType?: InventoryTypeName
) {
  const where: Record<string, unknown> = {
    equipmentProgram: EQUIPMENT_PROGRAM_CRIMINOLOGY,
  };

  if (inventoryType) {
    where.inventoryType = inventoryType;
  }

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
      _count: { select: { transactions: true } },
      transactions: {
        include: {
          user: { select: { id: true, name: true } },
          borrower: {
            select: {
              id: true,
              fullName: true,
              idNumber: true,
              personType: true,
              department: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });
}

export async function getItemStock(itemId: string): Promise<number> {
  const item = await db.item.findUnique({
    where: { id: itemId },
    select: { inventoryType: true },
  });
  if (!item) return 0;

  const result = await db.transaction.groupBy({
    by: ["type"],
    where: { itemId },
    _sum: { quantity: true },
  });

  let stock = 0;
  for (const row of result) {
    const qty = row._sum.quantity ?? 0;
    if (item.inventoryType === INVENTORY_TYPES.CONSUMABLE) {
      if (row.type === "IN") stock += qty;
      else if (row.type === "OUT") stock -= qty;
    } else {
      if (row.type === "IN" || row.type === "RETURN") stock += qty;
      else if (row.type === "OUT") stock -= qty;
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
      inventoryType: parsed.inventoryType,
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
    details: `Created ${parsed.inventoryType.toLowerCase()} item: ${item.name}`,
  });

  revalidatePathsForItemType(parsed.inventoryType);
  return item;
}

export async function updateItem(id: string, data: unknown) {
  const session = await requireRole(["Admin", "Custodian"]);
  const parsed = updateItemSchema.parse(data);

  const existing = await db.item.findUnique({ where: { id } });
  if (!existing) throw new Error("Item not found");

  const item = await db.item.update({
    where: { id },
    data: {
      ...parsed,
      equipmentProgram: EQUIPMENT_PROGRAM_CRIMINOLOGY,
    },
  });

  await createAuditLog({
    userId: session.user.id,
    action: "UPDATE_ITEM",
    entity: "Item",
    entityId: item.id,
    details: `Updated item: ${item.name}`,
  });

  revalidatePathsForItemType(existing.inventoryType);
  if (parsed.inventoryType && parsed.inventoryType !== existing.inventoryType) {
    revalidatePathsForItemType(parsed.inventoryType);
  }
  revalidatePath(`/inventory/${id}`);
  revalidatePath(`/consumables/${id}`);
  return item;
}

export async function deleteItem(id: string) {
  const session = await requireRole(["Admin"]);

  const item = await db.item.findUnique({
    where: { id },
    include: { _count: { select: { transactions: true } } },
  });
  if (!item) throw new Error("Item not found");

  const stock = await getItemStock(id);
  if (item._count.transactions > 0 || stock > 0) {
    throw new Error(
      `Cannot delete "${item.name}" because it has ${stock} unit(s) on hand and/or ${item._count.transactions} transaction record(s). Release or return all stock first, or keep the item for audit history.`
    );
  }

  await db.item.delete({ where: { id } });

  await createAuditLog({
    userId: session.user.id,
    action: "DELETE_ITEM",
    entity: "Item",
    entityId: id,
    details: `Deleted item: ${item.name}`,
  });

  revalidatePathsForItemType(item.inventoryType);
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

function revalidatePathsForItemType(inventoryType: string) {
  revalidatePath("/dashboard");
  revalidatePath("/inventory");
  revalidatePath("/consumables");
  revalidatePath("/transactions");
  revalidatePath("/reports");
  revalidatePath("/scan");
  if (inventoryType === INVENTORY_TYPES.CONSUMABLE) {
    revalidatePath("/consumables");
  }
}
