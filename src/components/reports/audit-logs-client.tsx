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
import { getAuditLogs } from "@/server/audit-logs";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

interface AuditLog {
  id: string;
  action: string;
  entity: string | null;
  entityId: string | null;
  details: string | null;
  createdAt: Date;
  user: { id: string; name: string };
}

const actionColors: Record<string, string> = {
  CREATE: "bg-emerald-100 text-emerald-800",
  UPDATE: "bg-blue-100 text-blue-800",
  DELETE: "bg-red-100 text-red-800",
  TRANSACTION: "bg-purple-100 text-purple-800",
};

function getActionColor(action: string): string {
  for (const [key, value] of Object.entries(actionColors)) {
    if (action.includes(key)) return value;
  }
  return "bg-gray-100 text-gray-800";
}

export function AuditLogsClient() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  async function loadData(p: number = 1) {
    setIsLoading(true);
    try {
      const result = await getAuditLogs({ page: p, limit: 20 });
      setLogs(result.logs);
      setTotalPages(result.totalPages);
      setPage(result.page);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading && logs.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">No audit logs yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getActionColor(log.action)}`}
                  >
                    {log.action}
                  </span>
                </TableCell>
                <TableCell>
                  {log.entity && (
                    <Badge variant="outline">{log.entity}</Badge>
                  )}
                </TableCell>
                <TableCell className="max-w-[300px] truncate text-muted-foreground">
                  {log.details ?? "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">{log.user.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(log.createdAt), "MMM d, yyyy h:mm a")}
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
    </div>
  );
}
