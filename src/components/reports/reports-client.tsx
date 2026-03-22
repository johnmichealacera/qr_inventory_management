"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { format } from "date-fns";
import { TRANSACTION_TYPE_LABELS } from "@/lib/constants";
import { Filter, Loader2, X } from "lucide-react";

interface Transaction {
  id: string;
  type: string;
  quantity: number;
  notes: string | null;
  createdAt: Date;
  item: { id: string; name: string };
  user: { id: string; name: string };
}

interface Item {
  id: string;
  name: string;
}

const typeBadgeVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  IN: "default",
  OUT: "destructive",
  RETURN: "secondary",
};

export function ReportsClient() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [itemId, setItemId] = useState("");
  const [type, setType] = useState("");

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
    Promise.all([loadData(), getItems().then((all) => setItems(all.map((i) => ({ id: i.id, name: i.name }))))]);
  }, []);

  function handleFilter() {
    loadData(1);
  }

  function handleClearFilters() {
    setStartDate("");
    setEndDate("");
    setItemId("");
    setType("");
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={handleFilter}>Apply Filters</Button>
            <Button variant="outline" onClick={handleClearFilters}>
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
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
