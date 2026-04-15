"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { Pagination } from "@/components/layout/pagination";
import { getTransactions } from "@/server/transactions";
import { getItems } from "@/server/items";
import { getBorrowers } from "@/server/borrowers";
import { createTransaction } from "@/server/transactions";
import { format } from "date-fns";
import { TRANSACTION_TYPE_LABELS } from "@/lib/constants";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import type { TransactionInput } from "@/lib/validations";

interface Item {
  id: string;
  name: string;
}

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

const typeBadgeVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  IN: "default",
  OUT: "destructive",
  RETURN: "secondary",
};

export function TransactionsClient() {
  const router = useRouter();
  const { data: session } = useSession();
  const canRecord = session?.user?.role === "Admin" || session?.user?.role === "Custodian";
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [borrowers, setBorrowers] = useState<
    { id: string; fullName: string; studentId: string }[]
  >([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  async function loadData(p: number = page) {
    setIsLoading(true);
    try {
      const [txResult, allItems, allBorrowers] = await Promise.all([
        getTransactions({ page: p, limit: 20 }),
        getItems(),
        getBorrowers(),
      ]);
      setTransactions(txResult.transactions);
      setTotalPages(txResult.totalPages);
      setPage(txResult.page);
      setItems(allItems.map((i) => ({ id: i.id, name: i.name })));
      setBorrowers(
        allBorrowers.map((b) => ({ id: b.id, fullName: b.fullName, studentId: b.studentId }))
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreate(data: TransactionInput) {
    try {
      await createTransaction(data);
      toast.success("Transaction recorded");
      setIsCreateOpen(false);
      loadData(1);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create transaction");
    }
  }

  if (isLoading && transactions.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {canRecord && (
        <div className="flex justify-end">
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger
              render={
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Transaction
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Transaction</DialogTitle>
                <DialogDescription>Create a new inventory transaction</DialogDescription>
              </DialogHeader>
              <TransactionForm items={items} borrowers={borrowers} onSubmit={handleCreate} />
            </DialogContent>
          </Dialog>
        </div>
      )}

      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">No transactions yet</p>
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
                    <TableCell className="max-w-[140px] truncate text-muted-foreground text-sm">
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
  );
}
