import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { canReviewConsumableRequests } from "@/lib/roles";
import { getConsumableRequestsForReview } from "@/server/consumable-requests";
import { PageHeader } from "@/components/layout/page-header";
import { ConsumableRequestsReviewClient } from "@/components/consumables/consumable-requests-review-client";

export default async function ConsumableRequestsPage() {
  const session = await auth();
  if (!canReviewConsumableRequests(session?.user?.role)) {
    redirect("/dashboard");
  }

  const requests = await getConsumableRequestsForReview();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Consumable requests"
        description="Review faculty and staff requests — canvassing, voucher, approval, and printable purchase request forms."
      />

      <ConsumableRequestsReviewClient requests={requests} />
    </div>
  );
}
