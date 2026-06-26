import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import {
  canManageConsumables,
  canSubmitConsumableRequest,
  canUseQrScanner,
  canViewConsumables,
  canViewReleaseLog,
} from "@/lib/roles";
import { getItemById, getItemStock } from "@/server/items";
// Panel feedback: delete policy notice hidden — revisit later if activation is needed
// import { ItemDeletePolicyNotice } from "@/components/inventory/item-delete-policy-notice";
import { INVENTORY_TYPES } from "@/lib/constants";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QRCodeDisplay } from "@/components/inventory/qr-code-display";
import { ItemDetailActions } from "@/components/inventory/item-detail-actions";
import { ConsumableRequestDialog } from "@/components/consumables/consumable-request-dialog";
import { ScanLine } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import {
  CONSUMABLE_TRANSACTION_TYPE_LABELS,
  formatRequesterLine,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ConsumableDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();
  const role = session?.user?.role;

  if (!canViewConsumables(role)) {
    redirect("/dashboard");
  }

  const canEditConsumable = canManageConsumables(role);
  const canViewReleases = canViewReleaseLog(role);
  const canRequest = canSubmitConsumableRequest(role);
  const canScan = canUseQrScanner(role);
  const item = await getItemById(id);
  if (!item || item.inventoryType !== INVENTORY_TYPES.CONSUMABLE) notFound();

  const currentStock = await getItemStock(id);
  const isLow = currentStock <= item.reorderLevel;

  return (
    <div className="space-y-6">
      <PageHeader title={item.name} description={item.description ?? undefined}>
        <div className="flex flex-wrap gap-2">
          {canRequest && (
            <ConsumableRequestDialog
              itemId={item.id}
              itemName={item.name}
              trigger={<Button>Request this item</Button>}
            />
          )}
          {canScan && item.qrCode && (
            <Link
              href={`/scan?value=${encodeURIComponent(item.qrCode.value)}`}
              className={cn(buttonVariants({ variant: "outline" }), "inline-flex items-center")}
            >
              <ScanLine className="mr-2 h-4 w-4" />
              Scan to transact
            </Link>
          )}
          {canEditConsumable && (
            <ItemDetailActions
              item={item}
              listPath="/consumables"
              inventoryType={INVENTORY_TYPES.CONSUMABLE}
              currentStock={currentStock}
              transactionCount={item._count.transactions}
            />
          )}
        </div>
      </PageHeader>

      {/* Panel feedback: delete policy notice hidden — revisit later if activation is needed */}
      {/* {canManage && session?.user?.role === "Admin" && <ItemDeletePolicyNotice />} */}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Item information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-muted-foreground">Category</dt>
                  <dd className="mt-1 font-medium">{item.category.name}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Current stock</dt>
                  <dd className="mt-1">
                    <Badge variant={isLow ? "destructive" : "secondary"}>
                      {currentStock} units
                    </Badge>
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Reorder level</dt>
                  <dd className="mt-1 font-medium">{item.reorderLevel}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Status</dt>
                  <dd className="mt-1">
                    <Badge variant={isLow ? "destructive" : "default"}>
                      {isLow ? "Low stock" : "In stock"}
                    </Badge>
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {canRequest && !canViewReleases ? "Stock status" : "Release history"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {canRequest && !canViewReleases ? (
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Available</dt>
                    <dd className="mt-1">
                      <Badge variant={isLow ? "destructive" : "secondary"}>
                        {currentStock} units
                      </Badge>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Reorder level</dt>
                    <dd className="mt-1 font-medium">{item.reorderLevel}</dd>
                  </div>
                </dl>
              ) : item.transactions.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  No releases yet
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Released to</TableHead>
                      <TableHead>By</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {item.transactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell>
                          <Badge
                            variant={
                              tx.type === "OUT"
                                ? "destructive"
                                : tx.type === "IN"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {CONSUMABLE_TRANSACTION_TYPE_LABELS[tx.type] ?? tx.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{tx.quantity}</TableCell>
                        <TableCell className="max-w-[200px] truncate text-muted-foreground text-sm">
                          {tx.borrower ? formatRequesterLine(tx.borrower) : "—"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {tx.user.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(tx.createdAt), "MMM d, yyyy h:mm a")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {canScan && (
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">QR Code</CardTitle>
            </CardHeader>
            <CardContent>
              {item.qrCode ? (
                <QRCodeDisplay
                  value={item.qrCode.value}
                  itemName={item.name}
                  scanHref={`/scan?value=${encodeURIComponent(item.qrCode.value)}`}
                />
              ) : (
                <p className="text-center text-sm text-muted-foreground">
                  No QR code generated
                </p>
              )}
            </CardContent>
          </Card>
        </div>
        )}
      </div>
    </div>
  );
}
