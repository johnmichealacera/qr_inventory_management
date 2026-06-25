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
import { CONSUMABLE_REQUEST_STATUS_LABELS } from "@/lib/constants";
import { ConsumableRequestDialog } from "@/components/consumables/consumable-request-dialog";
import { Plus } from "lucide-react";

type RequestRow = {
  id: string;
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
              Need a supply that is not listed under Consumables? Submit an off-catalog request for
              GSO to review.
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
            Track pending, approved, and fulfilled consumable requests.
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
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Review</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((row) => (
                  <TableRow key={row.id}>
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
                        {row.notes && (
                          <p className="mt-1 text-xs text-muted-foreground">{row.notes}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{row.quantity}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(row.status)}>
                        {CONSUMABLE_REQUEST_STATUS_LABELS[
                          row.status as keyof typeof CONSUMABLE_REQUEST_STATUS_LABELS
                        ] ?? row.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(row.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {row.reviewNotes ? (
                        <span title={row.reviewNotes}>{row.reviewNotes}</span>
                      ) : row.reviewedBy ? (
                        `By ${row.reviewedBy.name}`
                      ) : (
                        "—"
                      )}
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
