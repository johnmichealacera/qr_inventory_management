"use client";

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

interface Item {
  id: string;
  name: string;
}

interface BorrowerOpt {
  id: string;
  fullName: string;
  studentId: string;
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Item</Label>
        <Select
          defaultValue={defaultItemId}
          onValueChange={(val) => setValue("itemId", val ?? "")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an item" />
          </SelectTrigger>
          <SelectContent>
            {items.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.name}
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
        <Select onValueChange={(val) => val && setValue("type", val as "IN" | "OUT" | "RETURN")}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="IN">Receive stock (IN)</SelectItem>
            <SelectItem value="OUT">Issue to borrower (OUT)</SelectItem>
            <SelectItem value="RETURN">Return from borrower</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="text-xs text-destructive">{errors.type.message}</p>
        )}
      </div>

      {(type === "OUT" || type === "RETURN") && (
        <div className="space-y-2">
          <Label>Borrower (student)</Label>
          <Select
            onValueChange={(val) =>
              setValue("borrowerId", typeof val === "string" ? val : "")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select registered borrower" />
            </SelectTrigger>
            <SelectContent>
              {borrowers.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.fullName} ({b.studentId})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.borrowerId && (
            <p className="text-xs text-destructive">{errors.borrowerId.message}</p>
          )}
          {borrowers.length === 0 && (
            <p className="text-xs text-muted-foreground">
              Register borrowers under Borrowers (students) first.
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

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Record transaction
      </Button>
    </form>
  );
}
