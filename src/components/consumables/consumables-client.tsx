"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ItemTable } from "@/components/inventory/item-table";
import { ConsumableReleaseLog } from "@/components/consumables/consumable-release-log";
import { Pagination } from "@/components/layout/pagination";
import { getItemsPaginated, getItemStock } from "@/server/items";
import { getCategories } from "@/server/categories";
import { CONSUMABLES_PAGE_SIZE, INVENTORY_TYPES } from "@/lib/constants";
import { mapSelectItems } from "@/lib/select-items";
import { Package, ClipboardList, ListOrdered, Loader2, Search } from "lucide-react";

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

interface Category {
  id: string;
  name: string;
}

export function ConsumablesClient({
  canAddConsumables = false,
  canViewReleaseLog = false,
  canManageItems = false,
  canRequest = false,
}: {
  canAddConsumables?: boolean;
  canViewReleaseLog?: boolean;
  canManageItems?: boolean;
  canRequest?: boolean;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCategories().then((cats) =>
      setCategories(cats.map((c) => ({ id: c.id, name: c.name })))
    );
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, categoryId]);

  const categorySelectItems = useMemo(
    () => [
      { value: "__all__", label: "All categories" },
      ...mapSelectItems(categories, (c) => c.id, (c) => c.name),
    ],
    [categories]
  );

  const selectedCategoryName = useMemo(
    () => categories.find((c) => c.id === categoryId)?.name,
    [categories, categoryId]
  );

  const loadData = useCallback(
    async (p: number) => {
      setIsLoading(true);
      try {
        const result = await getItemsPaginated({
          page: p,
          limit: CONSUMABLES_PAGE_SIZE,
          inventoryType: INVENTORY_TYPES.CONSUMABLE,
          search: debouncedSearch || undefined,
          categoryId: categoryId || undefined,
        });

        const itemsWithStock = await Promise.all(
          result.items.map(async (item) => ({
            ...item,
            currentStock: await getItemStock(item.id),
          }))
        );

        setItems(itemsWithStock);
        setTotal(result.total);
        setTotalPages(result.totalPages);
        setPage(result.page);
      } finally {
        setIsLoading(false);
      }
    },
    [debouncedSearch, categoryId]
  );

  useEffect(() => {
    void loadData(page);
  }, [debouncedSearch, categoryId, page, loadData]);

  const hasFilters = Boolean(debouncedSearch || categoryId);

  return (
    <Tabs defaultValue="items" className="space-y-4">
      <TabsList className="flex h-auto w-full flex-wrap items-center justify-between gap-2 bg-transparent p-0">
        <div className="inline-flex h-9 items-center rounded-lg bg-muted p-1 text-muted-foreground">
          <TabsTrigger value="items" className="gap-2">
            <Package className="h-4 w-4" />
            {canRequest && !canAddConsumables ? "Catalog" : "Consumable items"}
          </TabsTrigger>
          {canViewReleaseLog && (
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
        <div className="grid gap-4 sm:grid-cols-2 lg:max-w-2xl">
          <div className="space-y-2">
            <Label htmlFor="consumable-search">Search</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="consumable-search"
                type="search"
                placeholder="Consumable name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              items={categorySelectItems}
              value={categoryId || "__all__"}
              onValueChange={(val) =>
                setCategoryId(val === "__all__" ? "" : (val ?? ""))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {canRequest && !canAddConsumables && (
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

        {isLoading && items.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {total > 0 && (
              <p className="text-sm text-muted-foreground">
                Showing page {page} of {totalPages} ({total} consumable
                {total === 1 ? "" : "s"}
                {debouncedSearch ? ` matching "${debouncedSearch}"` : ""}
                {selectedCategoryName ? ` in ${selectedCategoryName}` : ""})
              </p>
            )}
            <ItemTable
              items={items}
              detailBasePath="/consumables"
              emptyAddHref="/consumables/new"
              emptyMessage={
                hasFilters
                  ? "No consumables match your filters"
                  : "No consumable items yet"
              }
              canManage={canManageItems}
              canRequest={canRequest}
            />
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </TabsContent>

      {canViewReleaseLog && (
        <TabsContent value="releases">
          <ConsumableReleaseLog />
        </TabsContent>
      )}
    </Tabs>
  );
}
