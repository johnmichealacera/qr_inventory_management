"use client";

import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { transactionSchema, type TransactionInput } from "@/lib/validations";
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
import { Loader2 } from "lucide-react";
import {
  INVENTORY_TYPES,
  INVENTORY_TYPE_LABELS,
  formatRequesterLine,
} from "@/lib/constants";
import { mapSelectItems } from "@/lib/select-items";
import type { InventoryTypeName } from "@/lib/constants";

interface Item {
  id: string;
  name: string;
  inventoryType: InventoryTypeName;
}

interface BorrowerOpt {
  id: string;
  fullName: string;
  idNumber: string;
  personType: string;
  department: string;
}

interface TransactionFormProps {
  items: Item[];
  borrowers: BorrowerOpt[];
  onSubmit: (data: TransactionInput) => Promise<void>;
  defaultItemId?: string;
}

export function TransactionForm({
  items,
  borrowers,
  onSubmit,
  defaultItemId,
}: TransactionFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TransactionInput>({
    resolver: zodResolver(transactionSchema) as Resolver<TransactionInput>,
    defaultValues: {
      itemId: defaultItemId ?? "",
      quantity: 1,
      borrowerId: "",
    },
  });

  const type = useWatch({ control, name: "type" });
  const itemId = useWatch({ control, name: "itemId" });

  const selectedItem = useMemo(
    () => items.find((i) => i.id === itemId),
    [items, itemId]
  );
  const isConsumable = selectedItem?.inventoryType === INVENTORY_TYPES.CONSUMABLE;

  const itemSelectItems = useMemo(
    () =>
      mapSelectItems(
        items,
        (item) => item.id,
        (item) =>
          `${item.name} (${INVENTORY_TYPE_LABELS[item.inventoryType] ?? item.inventoryType})`
      ),
    [items]
  );

  const borrowerSelectItems = useMemo(
    () =>
      mapSelectItems(borrowers, (b) => b.id, (b) => formatRequesterLine(b)),
    [borrowers]
  );

  const transactionTypeItems = useMemo(() => {
    const options = [
      { value: "IN", label: "Receive stock (IN)" },
      {
        value: "OUT",
        label: isConsumable
          ? "Release to requester (OUT)"
          : "Issue to requester (OUT)",
      },
    ];
    if (!isConsumable && selectedItem) {
      options.push({ value: "RETURN", label: "Return from requester" });
    } else if (!selectedItem) {
      options.push({
        value: "RETURN",
        label: "Return from requester (borrowable only)",
      });
    }
    return options;
  }, [isConsumable, selectedItem]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Item</Label>
        <Select
          items={itemSelectItems}
          defaultValue={defaultItemId}
          onValueChange={(val) => setValue("itemId", val ?? "")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an item" />
          </SelectTrigger>
          <SelectContent>
            {items.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.name} (
                {INVENTORY_TYPE_LABELS[item.inventoryType] ?? item.inventoryType})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.itemId && (
          <p className="text-xs text-destructive">{errors.itemId.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Transaction type</Label>
        <Select
          items={transactionTypeItems}
          onValueChange={(val) => val && setValue("type", val as "IN" | "OUT" | "RETURN")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="IN">
              {isConsumable ? "Receive stock (IN)" : "Receive stock (IN)"}
            </SelectItem>
            <SelectItem value="OUT">
              {isConsumable ? "Release to requester (OUT)" : "Issue to requester (OUT)"}
            </SelectItem>
            {!isConsumable && selectedItem && (
              <SelectItem value="RETURN">Return from requester</SelectItem>
            )}
            {!selectedItem && (
              <SelectItem value="RETURN">Return from requester (borrowable only)</SelectItem>
            )}
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="text-xs text-destructive">{errors.type.message}</p>
        )}
        {isConsumable && type === "RETURN" && (
          <p className="text-xs text-destructive">
            Consumable items cannot be returned. Choose Release instead.
          </p>
        )}
      </div>

      {(type === "OUT" || type === "RETURN") && (
        <div className="space-y-2">
          <Label>Requester</Label>
          <Select
            items={borrowerSelectItems}
            onValueChange={(val) =>
              setValue("borrowerId", typeof val === "string" ? val : "")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select registered requester" />
            </SelectTrigger>
            <SelectContent>
              {borrowers.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {formatRequesterLine(b)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.borrowerId && (
            <p className="text-xs text-destructive">{errors.borrowerId.message}</p>
          )}
          {borrowers.length === 0 && (
            <p className="text-xs text-muted-foreground">
              Register requesters under Requesters first.
            </p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input id="quantity" type="number" min={1} {...register("quantity")} />
        {errors.quantity && (
          <p className="text-xs text-destructive">{errors.quantity.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea id="notes" placeholder="Add a note..." {...register("notes")} />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || (isConsumable && type === "RETURN")}
      >
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Record transaction
      </Button>
    </form>
  );
}
