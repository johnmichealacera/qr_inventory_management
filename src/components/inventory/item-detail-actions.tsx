"use client";

import { useState } from "react";
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
import { useEffect } from "react";

interface ItemDetailActionsProps {
  item: {
    id: string;
    name: string;
    description: string | null;
    categoryId: string;
    reorderLevel: number;
  };
}

interface Category {
  id: string;
  name: string;
}

export function ItemDetailActions({ item }: ItemDetailActionsProps) {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (isEditOpen) {
      getCategories().then(setCategories);
    }
  }, [isEditOpen]);

  async function handleUpdate(data: CreateItemInput) {
    try {
      await updateItem(item.id, data);
      toast.success("Item updated successfully");
      setIsEditOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update");
    }
  }

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) return;
    try {
      await deleteItem(item.id);
      toast.success("Item deleted");
      router.push("/inventory");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete");
    }
  }

  return (
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
            defaultValues={{
              name: item.name,
              description: item.description ?? "",
              categoryId: item.categoryId,
              reorderLevel: item.reorderLevel,
            }}
            onSubmit={handleUpdate}
            submitLabel="Update Item"
          />
        </DialogContent>
      </Dialog>

      <Button variant="destructive" size="sm" onClick={handleDelete}>
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </Button>
    </div>
  );
}
