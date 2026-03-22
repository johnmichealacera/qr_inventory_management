"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { QRScanner } from "@/components/scan/qr-scanner";
import { ScanResult } from "@/components/scan/scan-result";
import { getItemByQRValue } from "@/server/items";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

interface ScannedItem {
  id: string;
  name: string;
  description: string | null;
  reorderLevel: number;
  currentStock: number;
  category: { id: string; name: string };
}

export default function ScanPage() {
  const [scannedItem, setScannedItem] = useState<ScannedItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [manualInput, setManualInput] = useState("");

  async function handleScan(value: string) {
    setIsLoading(true);
    try {
      const item = await getItemByQRValue(value);
      if (!item) {
        toast.error("Item not found for this QR code");
        return;
      }
      setScannedItem(item);
    } catch {
      toast.error("Failed to fetch item details");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleManualSearch() {
    if (!manualInput.trim()) return;
    await handleScan(manualInput.trim());
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="QR Scanner"
        description="Scan an item QR code to perform a transaction"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <QRScanner onScan={handleScan} />

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Manual Entry</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter QR code value (e.g. INV-abc123)"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleManualSearch()}
                />
                <Button onClick={handleManualSearch} disabled={isLoading}>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          {isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </CardContent>
            </Card>
          ) : scannedItem ? (
            <ScanResult
              item={scannedItem}
              onClear={() => {
                setScannedItem(null);
                setManualInput("");
              }}
            />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">
                  Scan a QR code or enter a code manually
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
