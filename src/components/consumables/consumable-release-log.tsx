"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/layout/pagination";
import { getConsumableReleases } from "@/server/transactions";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { PERSON_TYPE_LABELS } from "@/lib/constants";
import type { PersonTypeName } from "@/lib/constants";

interface ReleaseRow {
  id: string;
  type: string;
  quantity: number;
  notes: string | null;
  createdAt: Date;
  item: { id: string; name: string };
  user: { name: string };
  borrower: {
    fullName: string;
    studentId: string;
    personType: string;
    department: string;
  } | null;
}

export function ConsumableReleaseLog() {
  const [rows, setRows] = useState<ReleaseRow[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  async function loadData(p: number = 1) {
    setIsLoading(true);
    try {
      const result = await getConsumableReleases({ page: p, limit: 20 });
      setRows(result.transactions as ReleaseRow[]);
      setTotalPages(result.totalPages);
      setTotal(result.total);
      setPage(result.page);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading && rows.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        No consumable releases recorded yet. Release stock from the Consumables tab or QR Scanner.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {total} release{total !== 1 ? "s" : ""} recorded (who received consumable supplies)
      </p>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Qty released</TableHead>
              <TableHead>Requester</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Released by</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell className="font-medium">{tx.item.name}</TableCell>
                <TableCell>{tx.quantity}</TableCell>
                <TableCell>
                  {tx.borrower ? (
                    <div>
                      <p className="font-medium">{tx.borrower.fullName}</p>
                      <p className="text-xs text-muted-foreground">
                        {tx.borrower.studentId} ·{" "}
                        {PERSON_TYPE_LABELS[tx.borrower.personType as PersonTypeName] ??
                          tx.borrower.personType}
                      </p>
                    </div>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {tx.borrower?.department ?? "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">{tx.user.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(tx.createdAt), "MMM d, yyyy h:mm a")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination page={page} totalPages={totalPages} onPageChange={(p) => loadData(p)} />
    </div>
  );
}
