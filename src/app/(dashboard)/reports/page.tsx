import { PageHeader } from "@/components/layout/page-header";
import { ReportsClient } from "@/components/reports/reports-client";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="View and filter transaction reports"
      />
      <ReportsClient />
    </div>
  );
}
