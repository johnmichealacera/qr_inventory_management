import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function ItemDeletePolicyNotice({ className }: { className?: string }) {
  return (
    <p
      role="note"
      className={cn(
        "flex items-start gap-2 rounded-lg border border-muted bg-muted/40 px-3 py-2 text-sm text-muted-foreground",
        className
      )}
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
      <span>
        <span className="font-medium text-foreground">Deletion policy:</span> Only items with{" "}
        <span className="font-medium text-foreground">no stock on hand</span> and no transaction
        history can be deleted. Clear or release all stock first if you need to remove an item.
      </span>
    </p>
  );
}
