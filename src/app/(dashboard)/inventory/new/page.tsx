"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { ItemForm } from "@/components/inventory/item-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createItem } from "@/server/items";
import { getCategories } from "@/server/categories";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { CreateItemInput } from "@/lib/validations";

interface Category {
  id: string;
  name: string;
}

export default function NewItemPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCategories().then((cats) => {
      setCategories(cats);
      setIsLoading(false);
    });
  }, []);

  async function handleSubmit(data: CreateItemInput) {
    try {
      await createItem(data);
      toast.success("Item created successfully");
      router.push("/inventory");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create item");
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Add New Item" description="Create a new inventory item" />
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Item Details</CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Please create a category first before adding items.
            </p>
          ) : (
            <ItemForm categories={categories} onSubmit={handleSubmit} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
