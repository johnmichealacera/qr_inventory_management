import type { ReactNode } from "react";
import { auth } from "@/lib/auth";
import { BORROWABLE_INVENTORY_ENABLED } from "@/lib/features";
import { redirect } from "next/navigation";

export default async function ScanLayout({ children }: { children: ReactNode }) {
  if (!BORROWABLE_INVENTORY_ENABLED) {
    redirect("/dashboard");
  }

  const session = await auth();
  if (session?.user?.role === "Auditor") {
    redirect("/dashboard");
  }
  return <>{children}</>;
}
