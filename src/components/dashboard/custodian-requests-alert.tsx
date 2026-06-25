import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList } from "lucide-react";

export function CustodianRequestsAlert({ pendingCount }: { pendingCount: number }) {
  if (pendingCount === 0) return null;

  return (
    <Card className="border-amber-200 bg-amber-50/80 shadow-lg ring-1 ring-amber-200/60 dark:border-amber-900/50 dark:bg-amber-950/30 dark:ring-amber-900/40">
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <ClipboardList className="h-5 w-5 text-amber-700 dark:text-amber-400" />
            Consumable requests
          </CardTitle>
          <CardDescription>
            {pendingCount} request{pendingCount === 1 ? "" : "s"} awaiting review from faculty or staff.
          </CardDescription>
        </div>
        <Link href="/consumable-requests">
          <Button size="sm">Review requests</Button>
        </Link>
      </CardHeader>
      <CardContent className="pt-0" />
    </Card>
  );
}
