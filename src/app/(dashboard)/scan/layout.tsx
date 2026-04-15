import type { ReactNode } from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ScanLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (session?.user?.role === "Auditor") {
    redirect("/dashboard");
  }
  return <>{children}</>;
}
