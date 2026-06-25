"use client";

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
import { Eye, QrCode, /* Trash2, */ ClipboardList } from "lucide-react";
import { ConsumableRequestDialog } from "@/components/consumables/consumable-request-dialog";
// import { deleteItem } from "@/server/items";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
import { INVENTORY_TYPE_LABELS } from "@/lib/constants";
// Panel feedback: delete UI hidden — revisit later if activation is needed
// import { ItemDeletePolicyNotice } from "@/components/inventory/item-delete-policy-notice";

interface Item {
  id: string;
  name: string;
  description: string | null;
  reorderLevel: number;
  inventoryType?: string;
  category: { id: string; name: string };
  qrCode: { id: string; value: string } | null;
  _count: { transactions: number };
  currentStock?: number;
}

interface ItemTableProps {
  items: Item[];
  detailBasePath?: string;
  emptyAddHref?: string;
  emptyMessage?: string;
  canManage?: boolean;
  canRequest?: boolean;
}

export function ItemTable({
  items,
  detailBasePath = "/inventory",
  emptyAddHref = "/inventory/new",
  emptyMessage = "No items found",
  canManage = false,
  canRequest = false,
}: ItemTableProps) {
  // Panel feedback: delete UI hidden — revisit later if activation is needed
  // const router = useRouter();
  // const { data: session } = useSession();
  // const isAdmin = session?.user?.role === "Admin";
  // const [deletingId, setDeletingId] = useState<string | null>(null);

  // async function handleDelete(id: string, name: string, stock: number, txCount: number) {
  //   if (stock > 0 || txCount > 0) {
  //     toast.error(
  //       `Cannot delete "${name}": ${stock} on hand and ${txCount} transaction(s). Clear stock first.`
  //     );
  //     return;
  //   }
  //   if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
  //   setDeletingId(id);
  //   try {
  //     await deleteItem(id);
  //     toast.success(`"${name}" has been deleted`);
  //     router.refresh();
  //   } catch (error) {
  //     toast.error(error instanceof Error ? error.message : "Failed to delete item");
  //   } finally {
  //     setDeletingId(null);
  //   }
  // }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
        {canManage && (
          <Link href={emptyAddHref}>
            <Button variant="outline" className="mt-4">
              Add your first item
            </Button>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Panel feedback: delete policy notice hidden — revisit later if activation is needed */}
      {/* {isAdmin && <ItemDeletePolicyNotice />} */}
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
            // const canDelete = isAdmin && stock === 0 && item._count.transactions === 0;

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
                    {item.inventoryType && (
                      <Badge variant="outline" className="mt-1 text-[10px]">
                        {INVENTORY_TYPE_LABELS[item.inventoryType as keyof typeof INVENTORY_TYPE_LABELS] ??
                          item.inventoryType}
                      </Badge>
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
                    {canRequest && (
                      <ConsumableRequestDialog
                        itemId={item.id}
                        itemName={item.name}
                        trigger={
                          <Button variant="outline" size="sm" className="h-8 gap-1 px-2 text-xs">
                            <ClipboardList className="h-3.5 w-3.5" />
                            Request
                          </Button>
                        }
                      />
                    )}
                    <Link href={`${detailBasePath}/${item.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    {/* Panel feedback: delete button hidden — revisit later if activation is needed */}
                    {/* {isAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive disabled:opacity-40"
                        onClick={() =>
                          handleDelete(
                            item.id,
                            item.name,
                            stock,
                            item._count.transactions
                          )
                        }
                        disabled={deletingId === item.id || !canDelete}
                        title={
                          canDelete
                            ? "Delete item"
                            : "Delete only when stock is 0 and no transactions"
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )} */}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      </div>
    </div>
  );
}
