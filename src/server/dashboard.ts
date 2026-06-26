"use server";

import { db } from "@/lib/db";
import { INVENTORY_TYPES } from "@/lib/constants";
import { BORROWABLE_INVENTORY_ENABLED } from "@/lib/features";
import { getItemStock } from "@/server/items";

export async function getDashboardStats() {
  const itemFilter = BORROWABLE_INVENTORY_ENABLED
    ? {}
    : { inventoryType: INVENTORY_TYPES.CONSUMABLE };

  const [totalItems, totalTransactions, recentTransactions, items] =
    await Promise.all([
      db.item.count({ where: itemFilter }),
      db.transaction.count({
        where: BORROWABLE_INVENTORY_ENABLED
          ? undefined
          : { item: { inventoryType: INVENTORY_TYPES.CONSUMABLE } },
      }),
      db.transaction.findMany({
        where: BORROWABLE_INVENTORY_ENABLED
          ? undefined
          : { item: { inventoryType: INVENTORY_TYPES.CONSUMABLE } },
        include: {
          item: { select: { id: true, name: true } },
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
        take: 5,
      }),
      db.item.findMany({
        where: itemFilter,
        select: { id: true, name: true, reorderLevel: true },
      }),
    ]);

  const stockPromises = items.map(async (item) => {
    const stock = await getItemStock(item.id);
    return { ...item, currentStock: stock };
  });

  const itemsWithStock = await Promise.all(stockPromises);
  const lowStockItems = itemsWithStock.filter(
    (item) => item.currentStock <= item.reorderLevel
  );

  return {
    totalItems,
    lowStockCount: lowStockItems.length,
    totalTransactions,
    recentTransactions,
    lowStockItems,
  };
}
