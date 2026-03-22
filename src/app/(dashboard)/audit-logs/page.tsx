import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { AuditLogsClient } from "@/components/reports/audit-logs-client";

export default async function AuditLogsPage() {
  const session = await auth();
  if (!session?.user || !["Admin", "Auditor"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        description="Track all system activities and user actions"
      />
      <AuditLogsClient />
    </div>
  );
}
