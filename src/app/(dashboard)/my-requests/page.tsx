import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { canSubmitConsumableRequest } from "@/lib/roles";
import { getMyConsumableRequests, getUserBorrowerProfile } from "@/server/consumable-requests";
import { PageHeader } from "@/components/layout/page-header";
import { MyRequestsClient } from "@/components/consumables/my-requests-client";
import { Card, CardContent } from "@/components/ui/card";

export default async function MyRequestsPage() {
  const session = await auth();
  if (!canSubmitConsumableRequest(session?.user?.role)) {
    redirect("/dashboard");
  }

  const [requests, borrower] = await Promise.all([
    getMyConsumableRequests(),
    getUserBorrowerProfile(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My requests"
        description="Submit and track consumable requests for the General Supplies Office."
      />

      {!borrower && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6 text-sm text-destructive">
            Your login is not linked to a requester profile. Contact an administrator before
            submitting requests.
          </CardContent>
        </Card>
      )}

      <MyRequestsClient requests={requests} />
    </div>
  );
}
