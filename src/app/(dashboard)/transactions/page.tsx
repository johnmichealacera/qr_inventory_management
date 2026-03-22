import { PageHeader } from "@/components/layout/page-header";
import { TransactionsClient } from "@/components/transactions/transactions-client";

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description="View and record inventory transactions"
      />
      <TransactionsClient />
    </div>
  );
}
