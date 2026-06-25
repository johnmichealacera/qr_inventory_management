"use client";

import { format } from "date-fns";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CONSUMABLE_REQUEST_STATUS_LABELS,
  type ConsumableRequestStatusName,
} from "@/lib/constants";
import { ConsumableRequestDialog } from "@/components/consumables/consumable-request-dialog";
import { Plus, Printer } from "lucide-react";

type RequestRow = {
  id: string;
  requestNumber: string;
  quantity: number;
  notes: string | null;
  customItemName: string | null;
  customDescription: string | null;
  status: string;
  reviewNotes: string | null;
  reviewedAt: Date | null;
  createdAt: Date;
  item: { id: string; name: string } | null;
  reviewedBy: { name: string } | null;
};

function statusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "PENDING":
      return "secondary";
    case "CANVASSING":
    case "FOR_VOUCHER":
      return "outline";
    case "APPROVED":
      return "default";
    case "FULFILLED":
      return "outline";
    case "REJECTED":
      return "destructive";
    default:
      return "secondary";
  }
}

function requestLabel(row: RequestRow) {
  if (row.item) return row.item.name;
  return row.customItemName ?? "Custom item";
}

export function MyRequestsClient({ requests }: { requests: RequestRow[] }) {
  return (
    <div className="space-y-6">
      <Card className="border-border/70 bg-card/85 shadow-lg ring-1 ring-black/5 backdrop-blur-sm dark:ring-white/10">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle className="text-base">Request something not in the catalog</CardTitle>
            <CardDescription>
              Need a supply that is not listed under Consumables? Submit an off-catalog purchase
              request for GSO to process (canvassing / voucher).
            </CardDescription>
          </div>
          <ConsumableRequestDialog
            trigger={
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New custom request
              </Button>
            }
          />
        </CardHeader>
      </Card>

      <Card className="border-border/70 bg-card/85 shadow-lg ring-1 ring-black/5 backdrop-blur-sm dark:ring-white/10">
        <CardHeader>
          <CardTitle className="text-base">Your requests</CardTitle>
          <CardDescription>
            Track status from pending review through canvassing, voucher, approval, and fulfillment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border/70 bg-muted/30 py-12 text-center">
              <p className="text-sm text-muted-foreground">No requests yet.</p>
              <Link href="/consumables">
                <Button variant="outline" size="sm">
                  Browse consumables
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PR #</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Form</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-mono text-xs">{row.requestNumber}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{requestLabel(row)}</p>
                        {row.customDescription && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {row.customDescription}
                          </p>
                        )}
                        {!row.item && (
                          <Badge variant="outline" className="mt-1 text-[10px]">
                            Off-catalog
                          </Badge>
                        )}
                        {row.reviewNotes && (
                          <p className="mt-1 text-xs text-muted-foreground">{row.reviewNotes}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{row.quantity}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(row.status)}>
                        {CONSUMABLE_REQUEST_STATUS_LABELS[
                          row.status as ConsumableRequestStatusName
                        ] ?? row.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(row.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/purchase-request/${row.id}`} target="_blank">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Printer className="h-3.5 w-3.5" />
                          Print
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
