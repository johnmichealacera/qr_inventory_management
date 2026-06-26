import { PageHeader } from "@/components/layout/page-header";
import { TransactionsClient } from "@/components/transactions/transactions-client";
import { BORROWABLE_INVENTORY_ENABLED } from "@/lib/features";

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description={
          BORROWABLE_INVENTORY_ENABLED
            ? "View and record inventory transactions"
            : "View and record consumable stock movements (receive and release)"
        }
      />
      <TransactionsClient />
    </div>
  );
}
