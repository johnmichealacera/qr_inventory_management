import Link from "next/link";
import { auth } from "@/lib/auth";
import { getItems, getItemStock } from "@/server/items";
import { INVENTORY_TYPES } from "@/lib/constants";
import { PageHeader } from "@/components/layout/page-header";
import { ConsumablesClient } from "@/components/consumables/consumables-client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function ConsumablesPage() {
  const session = await auth();
  const canManage =
    session?.user?.role === "Admin" || session?.user?.role === "Custodian";

  const items = await getItems(undefined, undefined, INVENTORY_TYPES.CONSUMABLE);

  const itemsWithStock = await Promise.all(
    items.map(async (item) => ({
      ...item,
      currentStock: await getItemStock(item.id),
    }))
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Consumables"
        description="Supplies that are released when used (not returned). Track who received each release in the Release log tab."
      >
        {canManage && (
          <Link href="/consumables/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add consumable
            </Button>
          </Link>
        )}
      </PageHeader>

      <ConsumablesClient items={itemsWithStock} />
    </div>
  );
}
