"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/layout/pagination";
import { getTransactions } from "@/server/transactions";
import { getItems } from "@/server/items";
import { getBorrowers } from "@/server/borrowers";
import { format } from "date-fns";
import { TRANSACTION_TYPE_LABELS } from "@/lib/constants";
import { Download, Filter, Loader2, X } from "lucide-react";

interface Transaction {
  id: string;
  type: string;
  quantity: number;
  notes: string | null;
  createdAt: Date;
  item: { id: string; name: string };
  user: { id: string; name: string };
  borrower: { id: string; fullName: string; studentId: string } | null;
}

interface Item {
  id: string;
  name: string;
}

interface BorrowerRow {
  id: string;
  fullName: string;
  studentId: string;
}

const typeBadgeVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  IN: "default",
  OUT: "destructive",
  RETURN: "secondary",
};

export function ReportsClient() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [borrowers, setBorrowers] = useState<BorrowerRow[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [itemId, setItemId] = useState("");
  const [type, setType] = useState("");
  const [borrowerId, setBorrowerId] = useState("");

  const exportHref = useMemo(() => {
    const p = new URLSearchParams();
    if (startDate) p.set("startDate", startDate);
    if (endDate) p.set("endDate", endDate);
    if (itemId) p.set("itemId", itemId);
    if (type) p.set("type", type);
    if (borrowerId) p.set("borrowerId", borrowerId);
    const q = p.toString();
    return q ? `/api/reports/export?${q}` : "/api/reports/export";
  }, [startDate, endDate, itemId, type, borrowerId]);

  async function loadData(p: number = 1) {
    setIsLoading(true);
    try {
      const result = await getTransactions({
        page: p,
        limit: 20,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        itemId: itemId || undefined,
        type: type || undefined,
        borrowerId: borrowerId || undefined,
      });
      setTransactions(result.transactions);
      setTotalPages(result.totalPages);
      setTotal(result.total);
      setPage(result.page);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
    void getItems().then((all) => setItems(all.map((i) => ({ id: i.id, name: i.name }))));
    void getBorrowers().then(setBorrowers);
  }, []);

  function handleFilter() {
    loadData(1);
  }

  function handleClearFilters() {
    setStartDate("");
    setEndDate("");
    setItemId("");
    setType("");
    setBorrowerId("");
    setTimeout(() => loadData(1), 0);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Item</Label>
              <Select value={itemId} onValueChange={(val) => setItemId(val ?? "")}>
                <SelectTrigger>
                  <SelectValue placeholder="All items" />
                </SelectTrigger>
                <SelectContent>
                  {items.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={(val) => setType(val ?? "")}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IN">Received (IN)</SelectItem>
                  <SelectItem value="OUT">Issued (OUT)</SelectItem>
                  <SelectItem value="RETURN">Returned</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Borrower</Label>
              <Select
                value={borrowerId || "__all__"}
                onValueChange={(val) => setBorrowerId(val === "__all__" ? "" : (val ?? ""))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All borrowers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All borrowers</SelectItem>
                  {borrowers.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.fullName} ({b.studentId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={handleFilter}>Apply Filters</Button>
            <Button variant="outline" onClick={handleClearFilters}>
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
            <Link
              href={exportHref}
              className={cn(buttonVariants({ variant: "outline" }), "inline-flex")}
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Link>
          </div>
        </CardContent>
      </Card>

      <div>
        <p className="mb-4 text-sm text-muted-foreground">
          {total} transaction{total !== 1 ? "s" : ""} found
        </p>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No transactions match your filters</p>
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Borrower</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>By</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-medium">{tx.item.name}</TableCell>
                      <TableCell>
                        <Badge variant={typeBadgeVariant[tx.type] ?? "outline"}>
                          {TRANSACTION_TYPE_LABELS[tx.type] ?? tx.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{tx.quantity}</TableCell>
                      <TableCell className="max-w-[180px] truncate text-muted-foreground text-sm">
                        {tx.borrower
                          ? `${tx.borrower.fullName} (${tx.borrower.studentId})`
                          : "—"}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-muted-foreground">
                        {tx.notes ?? "—"}
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
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={(p) => loadData(p)}
            />
          </>
        )}
      </div>
    </div>
  );
}
