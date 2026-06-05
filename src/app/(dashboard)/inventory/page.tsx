import Link from "next/link";
import { auth } from "@/lib/auth";
import { canManageInventory } from "@/lib/roles";
import { getItems, getItemStock } from "@/server/items";
import { INVENTORY_TYPES } from "@/lib/constants";
import { PageHeader } from "@/components/layout/page-header";
import { ItemTable } from "@/components/inventory/item-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function InventoryPage() {
  const session = await auth();
  const canManageInventoryRole = canManageInventory(session?.user?.role);

  const items = await getItems(undefined, undefined, INVENTORY_TYPES.BORROWABLE);

  const itemsWithStock = await Promise.all(
    items.map(async (item) => ({
      ...item,
      currentStock: await getItemStock(item.id),
    }))
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Borrowable inventory"
        description="Equipment and items that are issued and returned (QR-tracked)"
      >
        {canManageInventoryRole && (
          <Link href="/inventory/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </Link>
        )}
      </PageHeader>

      <ItemTable items={itemsWithStock} canManage={canManageInventoryRole} />
    </div>
  );
}
