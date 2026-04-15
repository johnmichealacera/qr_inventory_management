import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { transactionSchema } from "@/lib/validations";
import { getItemStock } from "@/server/items";
import { createAuditLog } from "@/lib/audit";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const page = Number(searchParams.get("page") ?? "1");
  const limit = Math.min(Number(searchParams.get("limit") ?? "20"), 100);
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

  const skip = (page - 1) * limit;

  const [transactions, total] = await Promise.all([
    db.transaction.findMany({
      where,
      include: {
        item: { select: { id: true, name: true } },
        user: { select: { id: true, name: true } },
        borrower: { select: { id: true, fullName: true, studentId: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    db.transaction.count({ where }),
  ]);

  return NextResponse.json({
    transactions,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!["Admin", "Custodian"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = transactionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const item = await db.item.findUnique({ where: { id: parsed.data.itemId } });
  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  if (parsed.data.type === "OUT") {
    const stock = await getItemStock(parsed.data.itemId);
    if (stock < parsed.data.quantity) {
      return NextResponse.json(
        { error: `Insufficient stock. Current: ${stock}, Requested: ${parsed.data.quantity}` },
        { status: 400 }
      );
    }
  }

  const transaction = await db.transaction.create({
    data: {
      itemId: parsed.data.itemId,
      userId: session.user.id,
      type: parsed.data.type,
      quantity: parsed.data.quantity,
      notes: parsed.data.notes,
      borrowerId:
        parsed.data.type === "IN" ? null : parsed.data.borrowerId?.trim() ?? null,
    },
    include: {
      item: { select: { id: true, name: true } },
      user: { select: { id: true, name: true } },
      borrower: { select: { id: true, fullName: true, studentId: true } },
    },
  });

  await createAuditLog({
    userId: session.user.id,
    action: `TRANSACTION_${parsed.data.type}`,
    entity: "Transaction",
    entityId: transaction.id,
    details: `${parsed.data.type} ${parsed.data.quantity} of ${item.name}`,
  });

  return NextResponse.json(transaction, { status: 201 });
}
