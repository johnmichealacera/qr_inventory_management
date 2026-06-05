"use client";

import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ItemTable } from "@/components/inventory/item-table";
import { ConsumableReleaseLog } from "@/components/consumables/consumable-release-log";
import { Plus, Package, ClipboardList } from "lucide-react";

interface Item {
  id: string;
  name: string;
  description: string | null;
  reorderLevel: number;
  inventoryType: string;
  category: { id: string; name: string };
  qrCode: { id: string; value: string } | null;
  _count: { transactions: number };
  currentStock?: number;
}

export function ConsumablesClient({
  items,
  canManage = false,
}: {
  items: Item[];
  canManage?: boolean;
}) {
  return (
    <Tabs defaultValue="items" className="space-y-4">
      <TabsList>
        <TabsTrigger value="items" className="gap-2">
          <Package className="h-4 w-4" />
          Consumable items
        </TabsTrigger>
        <TabsTrigger value="releases" className="gap-2">
          <ClipboardList className="h-4 w-4" />
          Release log
        </TabsTrigger>
      </TabsList>

      <TabsContent value="items" className="space-y-4">
        {canManage && (
          <div className="flex justify-end">
            <Link href="/consumables/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add consumable
              </Button>
            </Link>
          </div>
        )}
        <ItemTable
          items={items}
          detailBasePath="/consumables"
          emptyAddHref="/consumables/new"
          emptyMessage="No consumable items yet"
          canManage={canManage}
        />
      </TabsContent>

      <TabsContent value="releases">
        <ConsumableReleaseLog />
      </TabsContent>
    </Tabs>
  );
}
