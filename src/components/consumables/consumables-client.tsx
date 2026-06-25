"use client";

import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ItemTable } from "@/components/inventory/item-table";
import { ConsumableReleaseLog } from "@/components/consumables/consumable-release-log";
import { Plus, Package, ClipboardList, ListOrdered } from "lucide-react";

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
  canRequest = false,
}: {
  items: Item[];
  canManage?: boolean;
  canRequest?: boolean;
}) {
  return (
    <Tabs defaultValue="items" className="space-y-4">
      <TabsList className="flex h-auto w-full flex-wrap items-center justify-between gap-2 bg-transparent p-0">
        <div className="inline-flex h-9 items-center rounded-lg bg-muted p-1 text-muted-foreground">
          <TabsTrigger value="items" className="gap-2">
            <Package className="h-4 w-4" />
            {canRequest && !canManage ? "Catalog" : "Consumable items"}
          </TabsTrigger>
          {canManage && (
            <TabsTrigger value="releases" className="gap-2">
              <ClipboardList className="h-4 w-4" />
              Release log
            </TabsTrigger>
          )}
        </div>
        {canRequest && (
          <Link href="/my-requests">
            <Button variant="outline" size="sm" className="gap-2">
              <ListOrdered className="h-4 w-4" />
              My requests
            </Button>
          </Link>
        )}
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
        {canRequest && !canManage && (
          <p className="text-sm text-muted-foreground">
            Browse available supplies and click <strong>Request</strong> on any item, or submit an{" "}
            <Link
              href="/my-requests"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              off-catalog request
            </Link>{" "}
            for items not listed here.
          </p>
        )}
        <ItemTable
          items={items}
          detailBasePath="/consumables"
          emptyAddHref="/consumables/new"
          emptyMessage="No consumable items yet"
          canManage={canManage}
          canRequest={canRequest}
        />
      </TabsContent>

      {canManage && (
        <TabsContent value="releases">
          <ConsumableReleaseLog />
        </TabsContent>
      )}
    </Tabs>
  );
}
