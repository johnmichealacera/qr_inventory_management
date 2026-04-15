import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = session.user.role;
  if (role !== "Admin" && role !== "Custodian" && role !== "Auditor") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = req.nextUrl;
  const itemId = searchParams.get("itemId") ?? undefined;
  const type = searchParams.get("type") ?? undefined;
  const borrowerId = searchParams.get("borrowerId") ?? undefined;
  const startDate = searchParams.get("startDate") ?? undefined;
  const endDate = searchParams.get("endDate") ?? undefined;

  const where: Record<string, unknown> = {};
  if (itemId) where.itemId = itemId;
  if (type) where.type = type;
  if (borrowerId) where.borrowerId = borrowerId;

  if (startDate || endDate) {
    const createdAt: Record<string, Date> = {};
    if (startDate) createdAt.gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      createdAt.lte = end;
    }
    where.createdAt = createdAt;
  }

  const rows = await db.transaction.findMany({
    where,
    include: {
      item: { select: { name: true } },
      user: { select: { name: true } },
      borrower: { select: { fullName: true, studentId: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 10_000,
  });

  const header = [
    "Date (ISO)",
    "Item",
    "Type",
    "Quantity",
    "Borrower name",
    "Student ID",
    "Recorded by",
    "Notes",
  ];

  const lines = [header.join(",")];

  for (const r of rows) {
    lines.push(
      [
        escapeCsv(r.createdAt.toISOString()),
        escapeCsv(r.item.name),
        escapeCsv(r.type),
        String(r.quantity),
        escapeCsv(r.borrower?.fullName ?? ""),
        escapeCsv(r.borrower?.studentId ?? ""),
        escapeCsv(r.user.name),
        escapeCsv(r.notes ?? ""),
      ].join(",")
    );
  }

  const csv = lines.join("\n");
  const filename = `inventory-transactions-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
