"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { createTransaction } from "@/server/transactions";
import { getBorrowers } from "@/server/borrowers";
import { toast } from "sonner";
import { ArrowDownToLine, ArrowUpFromLine, RotateCcw, Loader2, X } from "lucide-react";
import {
  INVENTORY_TYPES,
  INVENTORY_TYPE_LABELS,
  formatRequesterLine,
} from "@/lib/constants";
import { mapSelectItems } from "@/lib/select-items";
import type { InventoryTypeName } from "@/lib/constants";

interface ScannedItem {
  id: string;
  name: string;
  description: string | null;
  reorderLevel: number;
  currentStock: number;
  inventoryType: InventoryTypeName;
  category: { name: string };
}

interface BorrowerOpt {
  id: string;
  fullName: string;
  idNumber: string;
  personType: string;
  department: string;
}

interface ScanResultProps {
  item: ScannedItem;
  onClear: () => void;
}

const borrowableActions = [
  {
    type: "IN" as const,
    label: "Receive",
    icon: ArrowDownToLine,
    color: "bg-emerald-600 hover:bg-emerald-700",
  },
  {
    type: "OUT" as const,
    label: "Issue",
    icon: ArrowUpFromLine,
    color: "bg-blue-600 hover:bg-blue-700",
  },
  {
    type: "RETURN" as const,
    label: "Return",
    icon: RotateCcw,
    color: "bg-amber-600 hover:bg-amber-700",
  },
];

const consumableActions = [
  {
    type: "IN" as const,
    label: "Receive stock",
    icon: ArrowDownToLine,
    color: "bg-emerald-600 hover:bg-emerald-700",
  },
  {
    type: "OUT" as const,
    label: "Release",
    icon: ArrowUpFromLine,
    color: "bg-blue-600 hover:bg-blue-700",
  },
];

export function ScanResult({ item, onClear }: ScanResultProps) {
  const router = useRouter();
  const isConsumable = item.inventoryType === INVENTORY_TYPES.CONSUMABLE;
  const transactionActions = useMemo(
    () => (isConsumable ? consumableActions : borrowableActions),
    [isConsumable]
  );

  const [selectedType, setSelectedType] = useState<"IN" | "OUT" | "RETURN" | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [borrowerId, setBorrowerId] = useState("");
  const [borrowers, setBorrowers] = useState<BorrowerOpt[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getBorrowers().then(setBorrowers).catch(() => setBorrowers([]));
  }, []);

  const borrowerSelectItems = useMemo(
    () =>
      mapSelectItems(borrowers, (b) => b.id, (b) => formatRequesterLine(b)),
    [borrowers]
  );

  useEffect(() => {
    setSelectedType(null);
    setBorrowerId("");
  }, [item.id]);

  async function handleSubmit() {
    if (!selectedType) return;
    if ((selectedType === "OUT" || selectedType === "RETURN") && !borrowerId) {
      toast.error("Select a requester for issuance, release, or return");
      return;
    }
    setIsSubmitting(true);

    try {
      await createTransaction({
        itemId: item.id,
        type: selectedType,
        quantity,
        notes: notes || undefined,
        borrowerId: selectedType === "IN" ? undefined : borrowerId || undefined,
      });
      const verb =
        selectedType === "IN"
          ? "Received"
          : selectedType === "OUT"
            ? isConsumable
              ? "Released"
              : "Issued"
            : "Returned";
      toast.success(`${verb} ${quantity} of ${item.name}`);
      onClear();
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Transaction failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  const isLow = item.currentStock <= item.reorderLevel;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          <span>Scanned item</span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClear}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border p-4">
          <h3 className="text-lg font-semibold">{item.name}</h3>
          {item.description && (
            <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="outline">{item.category.name}</Badge>
            <Badge variant="outline">
              {INVENTORY_TYPE_LABELS[item.inventoryType] ?? item.inventoryType}
            </Badge>
            <Badge variant={isLow ? "destructive" : "secondary"}>
              Stock: {item.currentStock}
            </Badge>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Select action</Label>
          <div
            className={`mt-2 grid gap-2 ${isConsumable ? "grid-cols-2" : "grid-cols-3"}`}
          >
            {transactionActions.map((action) => (
              <Button
                key={action.type}
                variant={selectedType === action.type ? "default" : "outline"}
                className={selectedType === action.type ? action.color : ""}
                onClick={() => setSelectedType(action.type)}
              >
                <action.icon className="mr-2 h-4 w-4" />
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        {selectedType && (
          <div className="space-y-4">
            {(selectedType === "OUT" || selectedType === "RETURN") && (
              <div className="space-y-2">
                <Label>Requester</Label>
                <Select
                  items={borrowerSelectItems}
                  value={borrowerId}
                  onValueChange={(val) => setBorrowerId(val ?? "")}
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
                {borrowers.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Register requesters under Requesters first.
                  </p>
                )}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add a note..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={isSubmitting || quantity < 1}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm{" "}
              {selectedType === "IN"
                ? "Receive"
                : selectedType === "OUT"
                  ? isConsumable
                    ? "Release"
                    : "Issue"
                  : "Return"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
