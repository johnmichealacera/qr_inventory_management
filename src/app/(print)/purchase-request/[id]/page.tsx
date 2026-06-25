import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { canReviewConsumableRequests, canSubmitConsumableRequest } from "@/lib/roles";
import { getConsumableRequestById } from "@/server/consumable-requests";
import { PurchaseRequestPrint } from "@/components/consumables/purchase-request-print";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PurchaseRequestPrintPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();
  const role = session?.user?.role;

  if (!role) redirect("/login");

  let request;
  try {
    request = await getConsumableRequestById(id);
  } catch {
    redirect("/dashboard");
  }

  if (!request) notFound();

  const canPrint =
    canReviewConsumableRequests(role) ||
    (canSubmitConsumableRequest(role) && request.userId === session.user.id);

  if (!canPrint) redirect("/dashboard");

  return <PurchaseRequestPrint request={request} />;
}
