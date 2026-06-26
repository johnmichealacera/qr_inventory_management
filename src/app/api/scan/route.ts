import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { lookupItemForScan } from "@/server/items";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const qrValue = req.nextUrl.searchParams.get("value");
  if (!qrValue) {
    return NextResponse.json({ error: "QR value is required" }, { status: 400 });
  }

  try {
    const item = await lookupItemForScan(qrValue);
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Lookup failed" },
      { status: 400 }
    );
  }
}
