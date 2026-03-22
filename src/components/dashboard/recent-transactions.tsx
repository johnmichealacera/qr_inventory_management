import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

interface Transaction {
  id: string;
  type: string;
  quantity: number;
  createdAt: Date;
  item: { id: string; name: string };
  user: { id: string; name: string };
}

const typeBadgeVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  IN: "default",
  OUT: "destructive",
  RETURN: "secondary",
};

export function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No transactions yet
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Qty</TableHead>
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
                  <TableCell className="text-muted-foreground">{tx.user.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(tx.createdAt), "MMM d, h:mm a")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
