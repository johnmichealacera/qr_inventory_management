"use server";

import { db } from "@/lib/db";
import { getItemStock } from "@/server/items";

export async function getDashboardStats() {
  const [totalItems, totalTransactions, recentTransactions, items] =
    await Promise.all([
      db.item.count(),
      db.transaction.count(),
      db.transaction.findMany({
        include: {
          item: { select: { id: true, name: true } },
          user: { select: { id: true, name: true } },
          borrower: { select: { id: true, fullName: true, studentId: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      db.item.findMany({
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
