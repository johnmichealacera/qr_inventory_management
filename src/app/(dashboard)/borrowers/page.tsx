import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { BorrowersClient } from "@/components/borrowers/borrowers-client";

export default async function BorrowersPage() {
  const session = await auth();
  if (!session?.user || !["Admin", "Custodian"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Requesters"
        description="Register staff and faculty with department — for borrow and consumable release tracking"
      />
      <BorrowersClient />
    </div>
  );
}
