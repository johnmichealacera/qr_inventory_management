"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { reviewConsumableRequest } from "@/server/consumable-requests";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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
  CONSUMABLE_REQUEST_TRANSITIONS,
  type ConsumableRequestStatusName,
  formatRequesterLine,
} from "@/lib/constants";
import { toast } from "sonner";
import { Loader2, Printer } from "lucide-react";
import type { ReviewConsumableRequestInput } from "@/lib/validations";

type ReviewRequest = {
  id: string;
  requestNumber: string;
  quantity: number;
  notes: string | null;
  customItemName: string | null;
  customDescription: string | null;
  status: string;
  reviewNotes: string | null;
  createdAt: Date;
  item: { id: string; name: string } | null;
  user: { name: string; username: string };
  borrower: {
    fullName: string;
    idNumber: string;
    personType: string;
    department: string;
  };
};

const ACTION_LABELS: Record<ReviewConsumableRequestInput["status"], string> = {
  CANVASSING: "For canvassing",
  FOR_VOUCHER: "For voucher",
  APPROVED: "Approve",
  REJECTED: "Reject",
  FULFILLED: "Mark fulfilled",
};

function requestLabel(row: ReviewRequest) {
  if (row.item) return row.item.name;
  return row.customItemName ?? "Custom item";
}

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

export function ConsumableRequestsReviewClient({ requests }: { requests: ReviewRequest[] }) {
  const router = useRouter();
  const [notesById, setNotesById] = useState<Record<string, string>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleReview(id: string, status: ReviewConsumableRequestInput["status"]) {
    setLoadingId(id);
    try {
      await reviewConsumableRequest(id, {
        status,
        reviewNotes: notesById[id] || undefined,
      });
      toast.success(`Request updated: ${CONSUMABLE_REQUEST_STATUS_LABELS[status]}`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Action failed");
    } finally {
      setLoadingId(null);
    }
  }

  const counts = {
    pending: requests.filter((r) => r.status === "PENDING").length,
    canvassing: requests.filter((r) => r.status === "CANVASSING").length,
    voucher: requests.filter((r) => r.status === "FOR_VOUCHER").length,
    approved: requests.filter((r) => r.status === "APPROVED").length,
    closed: requests.filter((r) => r.status === "REJECTED" || r.status === "FULFILLED").length,
  };

  const active = requests.filter(
    (r) => r.status !== "REJECTED" && r.status !== "FULFILLED"
  );
  const closed = requests.filter(
    (r) => r.status === "REJECTED" || r.status === "FULFILLED"
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {(
          [
            ["Pending", counts.pending],
            ["Canvassing", counts.canvassing],
            ["For voucher", counts.voucher],
            ["Approved", counts.approved],
            ["Closed", counts.closed],
          ] as const
        ).map(([label, count]) => (
          <Card
            key={label}
            className="border-border/70 bg-card/85 shadow-lg ring-1 ring-black/5 backdrop-blur-sm dark:ring-white/10"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{count}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <RequestTable
        title="Active requests"
        requests={active}
        notesById={notesById}
        setNotesById={setNotesById}
        loadingId={loadingId}
        onReview={handleReview}
        showActions
      />

      <RequestTable title="Closed requests" requests={closed} showPrintOnly />
    </div>
  );
}

function RequestTable({
  title,
  requests,
  notesById,
  setNotesById,
  loadingId,
  onReview,
  showActions,
  showPrintOnly,
}: {
  title: string;
  requests: ReviewRequest[];
  notesById?: Record<string, string>;
  setNotesById?: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  loadingId?: string | null;
  onReview?: (id: string, status: ReviewConsumableRequestInput["status"]) => void;
  showActions?: boolean;
  showPrintOnly?: boolean;
}) {
  if (requests.length === 0) return null;

  return (
    <Card className="border-border/70 bg-card/85 shadow-lg ring-1 ring-black/5 backdrop-blur-sm dark:ring-white/10">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PR #</TableHead>
              <TableHead>Requester</TableHead>
              <TableHead>Item</TableHead>
              <TableHead className="text-center">Qty</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="min-w-[200px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((row) => {
              const transitions =
                CONSUMABLE_REQUEST_TRANSITIONS[row.status as ConsumableRequestStatusName] ?? [];

              return (
                <TableRow key={row.id}>
                  <TableCell className="font-mono text-xs">{row.requestNumber}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium">{row.user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatRequesterLine(row.borrower)}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{requestLabel(row)}</p>
                      {row.customDescription && (
                        <p className="text-xs text-muted-foreground">{row.customDescription}</p>
                      )}
                      {!row.item && (
                        <Badge variant="outline" className="mt-1 text-[10px]">
                          Off-catalog
                        </Badge>
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
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                    {format(new Date(row.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <Link href={`/purchase-request/${row.id}`} target="_blank">
                        <Button variant="outline" size="sm" className="w-full gap-1">
                          <Printer className="h-3.5 w-3.5" />
                          Print form
                        </Button>
                      </Link>
                      {showActions &&
                        !showPrintOnly &&
                        onReview &&
                        notesById &&
                        setNotesById &&
                        transitions.length > 0 && (
                          <>
                            <Textarea
                              rows={2}
                              placeholder="GSO remarks (optional)"
                              value={notesById[row.id] ?? ""}
                              onChange={(e) =>
                                setNotesById((prev) => ({ ...prev, [row.id]: e.target.value }))
                              }
                              className="text-sm"
                            />
                            <div className="flex flex-wrap gap-1">
                              {transitions.map((next) => (
                                <Button
                                  key={next}
                                  size="sm"
                                  variant={next === "REJECTED" ? "destructive" : "default"}
                                  onClick={() =>
                                    onReview(row.id, next as ReviewConsumableRequestInput["status"])
                                  }
                                  disabled={loadingId === row.id}
                                >
                                  {loadingId === row.id ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    ACTION_LABELS[next as ReviewConsumableRequestInput["status"]]
                                  )}
                                </Button>
                              ))}
                            </div>
                          </>
                        )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
