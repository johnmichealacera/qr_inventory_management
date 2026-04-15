import Link from "next/link";
import { auth } from "@/lib/auth";
import { getItems, getItemStock } from "@/server/items";
import { PageHeader } from "@/components/layout/page-header";
import { ItemTable } from "@/components/inventory/item-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function InventoryPage() {
  const session = await auth();
  const canManageInventory =
    session?.user?.role === "Admin" || session?.user?.role === "Custodian";

  const items = await getItems();

  const itemsWithStock = await Promise.all(
    items.map(async (item) => ({
      ...item,
      currentStock: await getItemStock(item.id),
    }))
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory"
        description="College of Criminology — equipment and supplies (QR-tracked)"
      >
        {canManageInventory && (
          <Link href="/inventory/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </Link>
        )}
      </PageHeader>

      <ItemTable items={itemsWithStock} />
    </div>
  );
}
