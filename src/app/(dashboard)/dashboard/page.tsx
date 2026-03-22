import { getDashboardStats } from "@/server/dashboard";
import { PageHeader } from "@/components/layout/page-header";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { LowStockAlert } from "@/components/dashboard/low-stock-alert";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your inventory system"
      />

      <SummaryCards
        totalItems={stats.totalItems}
        lowStockCount={stats.lowStockCount}
        totalTransactions={stats.totalTransactions}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentTransactions transactions={stats.recentTransactions} />
        <LowStockAlert items={stats.lowStockItems} />
      </div>
    </div>
  );
}
