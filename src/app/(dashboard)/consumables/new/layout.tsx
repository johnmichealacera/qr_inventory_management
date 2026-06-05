import { auth } from "@/lib/auth";
import { canManageInventory } from "@/lib/roles";
import { redirect } from "next/navigation";

export default async function NewConsumableLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!canManageInventory(session?.user?.role)) {
    redirect("/consumables");
  }
  return children;
}
