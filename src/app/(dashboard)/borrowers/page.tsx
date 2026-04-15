import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getBorrowers } from "@/server/borrowers";
import { PageHeader } from "@/components/layout/page-header";
import { BorrowersClient } from "@/components/borrowers/borrowers-client";

export default async function BorrowersPage() {
  const session = await auth();
  if (!session?.user || !["Admin", "Custodian"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  const borrowers = await getBorrowers();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Borrowers (students)"
        description="Register students for equipment issuance and return tracking — College of Criminology"
      />
      <BorrowersClient initialBorrowers={borrowers} />
    </div>
  );
}
