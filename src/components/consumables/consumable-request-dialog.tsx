"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createConsumableRequestSchema,
  type CreateConsumableRequestInput,
} from "@/lib/validations";
import { createConsumableRequest } from "@/server/consumable-requests";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ClipboardList, Loader2 } from "lucide-react";

interface ConsumableRequestDialogProps {
  itemId?: string;
  itemName?: string;
  trigger?: React.ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ConsumableRequestDialog({
  itemId,
  itemName,
  trigger,
  open: controlledOpen,
  onOpenChange,
}: ConsumableRequestDialogProps) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  const isCustom = !itemId;

  const form = useForm<CreateConsumableRequestInput>({
    resolver: zodResolver(createConsumableRequestSchema) as Resolver<CreateConsumableRequestInput>,
    defaultValues: {
      itemId: itemId ?? "",
      customItemName: "",
      customDescription: "",
      quantity: 1,
      notes: "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      reset({
        itemId: itemId ?? "",
        customItemName: "",
        customDescription: "",
        quantity: 1,
        notes: "",
      });
    }
  }

  async function onSubmit(data: CreateConsumableRequestInput) {
    try {
      await createConsumableRequest({
        ...data,
        itemId: itemId || data.itemId || undefined,
        customItemName: isCustom ? data.customItemName : undefined,
        customDescription: isCustom ? data.customDescription : undefined,
      });
      toast.success("Request submitted for GSO review");
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit request");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isCustom ? "Request item not in catalog" : `Request: ${itemName}`}
          </DialogTitle>
          <DialogDescription>
            {isCustom
              ? "Describe the supply you need. GSO will review and source it if approved."
              : "Submit a request for this consumable. A custodian will review before release."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {isCustom && (
            <>
              <div className="space-y-2">
                <Label htmlFor="customItemName">Item name *</Label>
                <Input
                  id="customItemName"
                  placeholder="e.g. Whiteboard markers — assorted colors"
                  {...register("customItemName")}
                />
                {errors.customItemName && (
                  <p className="text-sm text-destructive">{errors.customItemName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="customDescription">Description</Label>
                <Textarea
                  id="customDescription"
                  rows={2}
                  placeholder="Size, brand preference, intended use…"
                  {...register("customDescription")}
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity *</Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              {...register("quantity")}
            />
            {errors.quantity && (
              <p className="text-sm text-destructive">{errors.quantity.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes / justification</Label>
            <Textarea
              id="notes"
              rows={2}
              placeholder="Purpose, event date, office location…"
              {...register("notes")}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                <ClipboardList className="mr-2 h-4 w-4" />
                Submit request
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
