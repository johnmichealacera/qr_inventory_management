"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ItemForm } from "@/components/inventory/item-form";
import { updateItem, deleteItem } from "@/server/items";
import { getCategories } from "@/server/categories";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import type { CreateItemInput } from "@/lib/validations";
import type { InventoryTypeName } from "@/lib/constants";
import { INVENTORY_TYPES } from "@/lib/constants";
import { useSession } from "next-auth/react";

interface ItemDetailActionsProps {
  item: {
    id: string;
    name: string;
    description: string | null;
    categoryId: string;
    reorderLevel: number;
    inventoryType?: InventoryTypeName;
  };
  listPath?: string;
  inventoryType?: InventoryTypeName;
  currentStock?: number;
  transactionCount?: number;
}

interface Category {
  id: string;
  name: string;
}

export function ItemDetailActions({
  item,
  listPath = "/inventory",
  inventoryType = item.inventoryType ?? INVENTORY_TYPES.BORROWABLE,
  currentStock = 0,
  transactionCount = 0,
}: ItemDetailActionsProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "Admin";
  const canDelete = isAdmin && currentStock === 0 && transactionCount === 0;
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (isEditOpen) {
      getCategories().then(setCategories);
    }
  }, [isEditOpen]);

  async function handleUpdate(data: CreateItemInput) {
    try {
      await updateItem(item.id, { ...data, inventoryType });
      toast.success("Item updated successfully");
      setIsEditOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update");
    }
  }

  async function handleDelete() {
    if (currentStock > 0 || transactionCount > 0) {
      toast.error(
        `Cannot delete "${item.name}": ${currentStock} on hand and ${transactionCount} transaction(s). Only items with no stock and no history can be deleted.`
      );
      return;
    }
    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) return;
    try {
      await deleteItem(item.id);
      toast.success("Item deleted");
      router.push(listPath);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete");
    }
  }

  return (
    <div className="flex flex-col items-end gap-3">
      <div className="flex gap-2">
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogTrigger
            render={
              <Button variant="outline" size="sm">
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Item</DialogTitle>
              <DialogDescription>Update the item details below</DialogDescription>
            </DialogHeader>
            <ItemForm
              categories={categories}
              fixedInventoryType={inventoryType}
              defaultValues={{
                name: item.name,
                description: item.description ?? "",
                categoryId: item.categoryId,
                reorderLevel: item.reorderLevel,
                inventoryType,
              }}
              onSubmit={handleUpdate}
              submitLabel="Update Item"
            />
          </DialogContent>
        </Dialog>

        {isAdmin && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={!canDelete}
            title={
              canDelete
                ? "Delete item"
                : "Only items with no stock and no transaction history can be deleted"
            }
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        )}
      </div>
      {isAdmin && !canDelete && (
        <p className="max-w-md text-right text-xs text-muted-foreground">
          Delete unavailable:{" "}
          {currentStock > 0
            ? `${currentStock} unit(s) still on hand`
            : "this item has transaction history"}
          .
        </p>
      )}
    </div>
  );
}
