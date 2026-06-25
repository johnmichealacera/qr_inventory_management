import { auth } from "@/lib/auth";
import { canManageConsumables } from "@/lib/roles";
import { redirect } from "next/navigation";

export default async function NewConsumableLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!canManageConsumables(session?.user?.role)) {
    redirect("/consumables");
  }
  return children;
}
