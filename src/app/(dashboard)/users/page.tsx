import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { UsersClient } from "@/components/reports/users-client";

export default async function UsersPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "Admin") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Manage system users and their roles"
      />
      <UsersClient />
    </div>
  );
}
