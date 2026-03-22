"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";

interface QRCodeDisplayProps {
  value: string;
  itemName: string;
}

export function QRCodeDisplay({ value, itemName }: QRCodeDisplayProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function generateQR() {
      try {
        const QRCode = (await import("qrcode")).default;
        const url = await QRCode.toDataURL(value, {
          width: 300,
          margin: 2,
          color: { dark: "#000000", light: "#ffffff" },
        });
        setDataUrl(url);
      } catch {
        console.error("Failed to generate QR code");
      } finally {
        setIsLoading(false);
      }
    }
    generateQR();
  }, [value]);

  function handleDownload() {
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `qr-${itemName.replace(/\s+/g, "-").toLowerCase()}.png`;
    link.click();
  }

  if (isLoading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!dataUrl) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Failed to generate QR code
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <img src={dataUrl} alt={`QR Code for ${itemName}`} className="rounded-lg border" />
      <p className="text-xs text-muted-foreground">{value}</p>
      <Button variant="outline" size="sm" onClick={handleDownload}>
        <Download className="mr-2 h-4 w-4" />
        Download QR Code
      </Button>
    </div>
  );
}
