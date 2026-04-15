import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { createItemSchema } from "@/lib/validations";
import { getItemStock } from "@/server/items";
import { createAuditLog } from "@/lib/audit";
import { EQUIPMENT_PROGRAM_CRIMINOLOGY } from "@/lib/constants";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const search = searchParams.get("search") ?? undefined;
  const categoryId = searchParams.get("categoryId") ?? undefined;

  const where: Record<string, unknown> = {
    equipmentProgram: EQUIPMENT_PROGRAM_CRIMINOLOGY,
  };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  if (categoryId) where.categoryId = categoryId;

  const items = await db.item.findMany({
    where,
    include: {
      category: true,
      qrCode: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const withStock = await Promise.all(
    items.map(async (item) => ({
      ...item,
      currentStock: await getItemStock(item.id),
    }))
  );

  return NextResponse.json(withStock);
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
  const parsed = createItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const item = await db.item.create({
    data: { ...parsed.data, equipmentProgram: EQUIPMENT_PROGRAM_CRIMINOLOGY },
  });

  await db.qRCode.create({
    data: { itemId: item.id, value: `INV-${item.id}` },
  });

  await createAuditLog({
    userId: session.user.id,
    action: "CREATE_ITEM",
    entity: "Item",
    entityId: item.id,
    details: `Created item: ${item.name}`,
  });

  return NextResponse.json(item, { status: 201 });
}
