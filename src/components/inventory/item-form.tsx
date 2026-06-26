"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { createItemSchema, type CreateItemInput } from "@/lib/validations";
import { INVENTORY_TYPES, INVENTORY_TYPE_LABELS } from "@/lib/constants";
import type { InventoryTypeName } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mapSelectItems } from "@/lib/select-items";
import { Loader2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface ItemFormProps {
  categories: Category[];
  defaultValues?: Partial<CreateItemInput>;
  onSubmit: (data: CreateItemInput) => Promise<void>;
  submitLabel?: string;
  /** Lock type when creating from borrowable vs consumables section */
  fixedInventoryType?: InventoryTypeName;
}

export function ItemForm({
  categories,
  defaultValues,
  onSubmit,
  submitLabel = "Create Item",
  fixedInventoryType,
}: ItemFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateItemInput>({
    resolver: zodResolver(createItemSchema) as Resolver<CreateItemInput>,
    defaultValues: {
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
      categoryId: defaultValues?.categoryId ?? "",
      reorderLevel: defaultValues?.reorderLevel ?? 10,
      inventoryType:
        fixedInventoryType ??
        defaultValues?.inventoryType ??
        INVENTORY_TYPES.BORROWABLE,
    },
  });

  const inventoryType = watch("inventoryType");
  const categoryId = watch("categoryId");

  const inventoryTypeItems = useMemo(
    () => [
      {
        value: INVENTORY_TYPES.BORROWABLE,
        label: `${INVENTORY_TYPE_LABELS.BORROWABLE} — issued and returned`,
      },
      {
        value: INVENTORY_TYPES.CONSUMABLE,
        label: `${INVENTORY_TYPE_LABELS.CONSUMABLE} — released when used (not returned)`,
      },
    ],
    []
  );

  const categoryItems = useMemo(
    () => mapSelectItems(categories, (cat) => cat.id, (cat) => cat.name),
    [categories]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {!fixedInventoryType && !defaultValues?.inventoryType && (
        <div className="space-y-2">
          <Label>Inventory type</Label>
          <Select
            items={inventoryTypeItems}
            value={inventoryType}
            onValueChange={(val) =>
              val &&
              setValue(
                "inventoryType",
                val as typeof INVENTORY_TYPES.BORROWABLE | typeof INVENTORY_TYPES.CONSUMABLE
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={INVENTORY_TYPES.BORROWABLE}>
                {INVENTORY_TYPE_LABELS.BORROWABLE} — issued and returned
              </SelectItem>
              <SelectItem value={INVENTORY_TYPES.CONSUMABLE}>
                {INVENTORY_TYPE_LABELS.CONSUMABLE} — released when used (not returned)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {fixedInventoryType && (
        <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
          Type: <strong>{INVENTORY_TYPE_LABELS[fixedInventoryType]}</strong>
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Item Name</Label>
        <Input id="name" placeholder="e.g. Evidence collection gloves" {...register("name")} />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Optional description..."
          {...register("description")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoryId">Category</Label>
        <Select
          items={categoryItems}
          value={categoryId}
          onValueChange={(val) => setValue("categoryId", val ?? "")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.categoryId && (
          <p className="text-xs text-destructive">{errors.categoryId.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="reorderLevel">Reorder Level</Label>
        <Input
          id="reorderLevel"
          type="number"
          min={0}
          {...register("reorderLevel")}
        />
        {errors.reorderLevel && (
          <p className="text-xs text-destructive">{errors.reorderLevel.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitLabel}
      </Button>
    </form>
  );
}
