"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, CameraOff } from "lucide-react";

interface QRScannerProps {
  onScan: (value: string) => void;
}

export function QRScanner({ onScan }: QRScannerProps) {
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrCodeRef = useRef<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startScanner() {
    if (!scannerRef.current) return;
    setError(null);

    try {
      const { Html5Qrcode } = await import("html5-qrcode");

      if (html5QrCodeRef.current) {
        await html5QrCodeRef.current.stop().catch(() => {});
        html5QrCodeRef.current.clear();
      }

      const scanner = new Html5Qrcode("qr-reader");
      html5QrCodeRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText: string) => {
          onScan(decodedText);
          scanner.stop().catch(() => {});
          setIsScanning(false);
        },
        () => {}
      );

      setIsScanning(true);
    } catch (err) {
      setError("Unable to access camera. Please check permissions.");
      setIsScanning(false);
    }
  }

  async function stopScanner() {
    if (html5QrCodeRef.current) {
      await html5QrCodeRef.current.stop().catch(() => {});
      html5QrCodeRef.current.clear();
      html5QrCodeRef.current = null;
    }
    setIsScanning(false);
  }

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          <span>QR Code Scanner</span>
          <Button
            variant={isScanning ? "destructive" : "default"}
            size="sm"
            onClick={isScanning ? stopScanner : startScanner}
          >
            {isScanning ? (
              <>
                <CameraOff className="mr-2 h-4 w-4" />
                Stop
              </>
            ) : (
              <>
                <Camera className="mr-2 h-4 w-4" />
                Start Scanner
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <div
          id="qr-reader"
          ref={scannerRef}
          className="mx-auto overflow-hidden rounded-lg"
          style={{ maxWidth: 400 }}
        />
        {!isScanning && !error && (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Click &quot;Start Scanner&quot; to scan an item QR code
          </p>
        )}
      </CardContent>
    </Card>
  );
}
