import Link from "next/link";
import { auth } from "@/lib/auth";
import { canManageConsumables, canSubmitConsumableRequest, canViewConsumables, canViewReleaseLog } from "@/lib/roles";
import { redirect } from "next/navigation";
import { getItems, getItemStock } from "@/server/items";
import { INVENTORY_TYPES } from "@/lib/constants";
import { PageHeader } from "@/components/layout/page-header";
import { ConsumablesClient } from "@/components/consumables/consumables-client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function ConsumablesPage() {
  const session = await auth();
  const role = session?.user?.role;

  if (!canViewConsumables(role)) {
    redirect("/dashboard");
  }

  const canAddConsumables = canManageConsumables(role);
  const canViewReleases = canViewReleaseLog(role);
  const canRequest = canSubmitConsumableRequest(role);

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
        description={
          canRequest && !canAddConsumables
            ? "View available supplies and submit requests for yourself. Off-catalog items can be requested from My requests."
            : "Supplies that are released when used (not returned). Track who received each release in the Release log tab."
        }
      >
        {canAddConsumables && (
          <Link href="/consumables/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add consumable
            </Button>
          </Link>
        )}
      </PageHeader>

      <ConsumablesClient
        items={itemsWithStock}
        canAddConsumables={canAddConsumables}
        canViewReleaseLog={canViewReleases}
        canManageItems={canAddConsumables}
        canRequest={canRequest}
      />
    </div>
  );
}
