"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { QRCodeDisplay } from "@/components/inventory/qr-code-display";
import { Eye, QrCode, Trash2 } from "lucide-react";
import { deleteItem } from "@/server/items";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Item {
  id: string;
  name: string;
  description: string | null;
  reorderLevel: number;
  category: { id: string; name: string };
  qrCode: { id: string; value: string } | null;
  _count: { transactions: number };
  currentStock?: number;
}

export function ItemTable({ items }: { items: Item[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    setDeletingId(id);
    try {
      await deleteItem(id);
      toast.success(`"${name}" has been deleted`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete item");
    } finally {
      setDeletingId(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">No items found</p>
        <Link href="/inventory/new">
          <Button variant="outline" className="mt-4">Add your first item</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-center">Stock</TableHead>
            <TableHead className="text-center">Reorder Level</TableHead>
            <TableHead className="text-center">QR Code</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const stock = item.currentStock ?? 0;
            const isLow = stock <= item.reorderLevel;

            return (
              <TableRow key={item.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    {item.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {item.description}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{item.category.name}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={isLow ? "destructive" : "secondary"}>
                    {stock}
                  </Badge>
                </TableCell>
                <TableCell className="text-center text-muted-foreground">
                  {item.reorderLevel}
                </TableCell>
                <TableCell className="text-center">
                  {item.qrCode && (
                    <Dialog>
                      <DialogTrigger
                        render={
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <QrCode className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <DialogContent className="max-w-sm">
                        <DialogHeader>
                          <DialogTitle>QR Code - {item.name}</DialogTitle>
                          <DialogDescription>
                            Scan this code to quickly access this item
                          </DialogDescription>
                        </DialogHeader>
                        <QRCodeDisplay value={item.qrCode.value} itemName={item.name} />
                      </DialogContent>
                    </Dialog>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/inventory/${item.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(item.id, item.name)}
                      disabled={deletingId === item.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
