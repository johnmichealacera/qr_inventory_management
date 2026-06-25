"use client";

import { useState } from "react";
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
  formatRequesterLine,
} from "@/lib/constants";
import { toast } from "sonner";
import { Check, Loader2, PackageCheck, X } from "lucide-react";

type ReviewRequest = {
  id: string;
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

function requestLabel(row: ReviewRequest) {
  if (row.item) return row.item.name;
  return row.customItemName ?? "Custom item";
}

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

export function ConsumableRequestsReviewClient({ requests }: { requests: ReviewRequest[] }) {
  const router = useRouter();
  const [notesById, setNotesById] = useState<Record<string, string>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleReview(
    id: string,
    status: "APPROVED" | "REJECTED" | "FULFILLED"
  ) {
    setLoadingId(id);
    try {
      await reviewConsumableRequest(id, {
        status,
        reviewNotes: notesById[id] || undefined,
      });
      toast.success(
        status === "APPROVED"
          ? "Request approved"
          : status === "REJECTED"
            ? "Request rejected"
            : "Request marked fulfilled"
      );
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Action failed");
    } finally {
      setLoadingId(null);
    }
  }

  const pending = requests.filter((r) => r.status === "PENDING");
  const inProgress = requests.filter((r) => r.status === "APPROVED");
  const closed = requests.filter((r) => r.status === "REJECTED" || r.status === "FULFILLED");

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/70 bg-card/85 shadow-lg ring-1 ring-black/5 backdrop-blur-sm dark:ring-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{pending.length}</p>
          </CardContent>
        </Card>
        <Card className="border-border/70 bg-card/85 shadow-lg ring-1 ring-black/5 backdrop-blur-sm dark:ring-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved (awaiting release)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{inProgress.length}</p>
          </CardContent>
        </Card>
        <Card className="border-border/70 bg-card/85 shadow-lg ring-1 ring-black/5 backdrop-blur-sm dark:ring-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Closed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{closed.length}</p>
          </CardContent>
        </Card>
      </div>

      <RequestTable
        title="Pending review"
        requests={pending}
        notesById={notesById}
        setNotesById={setNotesById}
        loadingId={loadingId}
        onReview={handleReview}
        showReviewActions
      />

      <RequestTable
        title="Approved — mark fulfilled after release"
        requests={inProgress}
        notesById={notesById}
        setNotesById={setNotesById}
        loadingId={loadingId}
        onReview={handleReview}
        showFulfillAction
      />

      <RequestTable title="Closed requests" requests={closed} />
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
  showReviewActions,
  showFulfillAction,
}: {
  title: string;
  requests: ReviewRequest[];
  notesById?: Record<string, string>;
  setNotesById?: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  loadingId?: string | null;
  onReview?: (id: string, status: "APPROVED" | "REJECTED" | "FULFILLED") => void;
  showReviewActions?: boolean;
  showFulfillAction?: boolean;
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
              <TableHead>Requester</TableHead>
              <TableHead>Item</TableHead>
              <TableHead className="text-center">Qty</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              {(showReviewActions || showFulfillAction) && <TableHead className="min-w-[220px]">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((row) => (
              <TableRow key={row.id}>
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
                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                  {format(new Date(row.createdAt), "MMM d, yyyy")}
                </TableCell>
                {showReviewActions && onReview && notesById && setNotesById && (
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <Textarea
                        rows={2}
                        placeholder="Review notes (optional)"
                        value={notesById[row.id] ?? ""}
                        onChange={(e) =>
                          setNotesById((prev) => ({ ...prev, [row.id]: e.target.value }))
                        }
                        className="text-sm"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => onReview(row.id, "APPROVED")}
                          disabled={loadingId === row.id}
                        >
                          {loadingId === row.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Check className="mr-1 h-3 w-3" />
                              Approve
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onReview(row.id, "REJECTED")}
                          disabled={loadingId === row.id}
                        >
                          <X className="mr-1 h-3 w-3" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                )}
                {showFulfillAction && onReview && notesById && setNotesById && (
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <Textarea
                        rows={2}
                        placeholder="Fulfillment notes (optional)"
                        value={notesById[row.id] ?? ""}
                        onChange={(e) =>
                          setNotesById((prev) => ({ ...prev, [row.id]: e.target.value }))
                        }
                        className="text-sm"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onReview(row.id, "FULFILLED")}
                        disabled={loadingId === row.id}
                      >
                        {loadingId === row.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <PackageCheck className="mr-1 h-3 w-3" />
                            Mark fulfilled
                          </>
                        )}
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
