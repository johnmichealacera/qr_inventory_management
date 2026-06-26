import { auth } from "@/lib/auth";
import { canManageInventory, isGsoOfficerRole, isRequesterRole } from "@/lib/roles";
import { BORROWABLE_INVENTORY_ENABLED } from "@/lib/features";
import { getDashboardStats } from "@/server/dashboard";
import { getMyRequestStats, getPendingRequestCountForReview } from "@/server/consumable-requests";
import { PageHeader } from "@/components/layout/page-header";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { LowStockAlert } from "@/components/dashboard/low-stock-alert";
import { RequesterDashboard } from "@/components/dashboard/requester-dashboard";
import { CustodianRequestsAlert } from "@/components/dashboard/custodian-requests-alert";

export default async function DashboardPage() {
  const session = await auth();
  const role = session?.user?.role;

  if (isRequesterRole(role)) {
    const stats = await getMyRequestStats();
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description="Request consumables from the General Supplies Office"
        />
        <RequesterDashboard stats={stats} />
      </div>
    );
  }

  if (isGsoOfficerRole(role)) {
    const pendingRequests = await getPendingRequestCountForReview();
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description="Manage consumable catalog and purchase requests"
        />
        <CustodianRequestsAlert pendingCount={pendingRequests} />
      </div>
    );
  }

  const [stats, pendingRequests] = await Promise.all([
    getDashboardStats(),
    canManageInventory(role) ? getPendingRequestCountForReview() : Promise.resolve(0),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={
          BORROWABLE_INVENTORY_ENABLED
            ? "Overview of your inventory system"
            : "Overview of General Supplies Office consumables and requests"
        }
      />

      {canManageInventory(role) && <CustodianRequestsAlert pendingCount={pendingRequests} />}

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
