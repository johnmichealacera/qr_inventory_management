import { notFound } from "next/navigation";
import { getItemById, getItemStock } from "@/server/items";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QRCodeDisplay } from "@/components/inventory/qr-code-display";
import { ItemDetailActions } from "@/components/inventory/item-detail-actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { TRANSACTION_TYPE_LABELS } from "@/lib/constants";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ItemDetailPage({ params }: PageProps) {
  const { id } = await params;
  const item = await getItemById(id);
  if (!item) notFound();

  const currentStock = await getItemStock(id);
  const isLow = currentStock <= item.reorderLevel;

  return (
    <div className="space-y-6">
      <PageHeader title={item.name} description={item.description ?? undefined}>
        <ItemDetailActions item={item} />
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Item Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-muted-foreground">Category</dt>
                  <dd className="mt-1 font-medium">{item.category.name}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Current Stock</dt>
                  <dd className="mt-1">
                    <Badge variant={isLow ? "destructive" : "secondary"}>
                      {currentStock} units
                    </Badge>
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Reorder Level</dt>
                  <dd className="mt-1 font-medium">{item.reorderLevel}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Status</dt>
                  <dd className="mt-1">
                    <Badge variant={isLow ? "destructive" : "default"}>
                      {isLow ? "Low Stock" : "In Stock"}
                    </Badge>
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {item.transactions.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  No transactions yet
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Borrower</TableHead>
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
                            {TRANSACTION_TYPE_LABELS[tx.type] ?? tx.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{tx.quantity}</TableCell>
                        <TableCell className="max-w-[160px] truncate text-muted-foreground text-sm">
                          {tx.borrower
                            ? `${tx.borrower.fullName} (${tx.borrower.studentId})`
                            : "—"}
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

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">QR Code</CardTitle>
            </CardHeader>
            <CardContent>
              {item.qrCode ? (
                <QRCodeDisplay value={item.qrCode.value} itemName={item.name} />
              ) : (
                <p className="text-center text-sm text-muted-foreground">
                  No QR code generated
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
