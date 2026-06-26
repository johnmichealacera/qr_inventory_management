import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { ScanPageClient } from "@/components/scan/scan-page-client";

export default function ScanPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <ScanPageClient />
    </Suspense>
  );
}
