import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { BORROWABLE_INVENTORY_ENABLED } from "@/lib/features";

export default function InventoryLayout({ children }: { children: ReactNode }) {
  if (!BORROWABLE_INVENTORY_ENABLED) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
