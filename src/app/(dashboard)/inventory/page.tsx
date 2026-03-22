import Link from "next/link";
import { getItems, getItemStock } from "@/server/items";
import { getCategories } from "@/server/categories";
import { PageHeader } from "@/components/layout/page-header";
import { ItemTable } from "@/components/inventory/item-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function InventoryPage() {
  const [items, categories] = await Promise.all([
    getItems(),
    getCategories(),
  ]);

  const itemsWithStock = await Promise.all(
    items.map(async (item) => ({
      ...item,
      currentStock: await getItemStock(item.id),
    }))
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Inventory" description="Manage your supply items">
        <Link href="/inventory/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </Link>
      </PageHeader>

      <ItemTable items={itemsWithStock} />
    </div>
  );
}
