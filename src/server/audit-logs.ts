"use server";

import { db } from "@/lib/db";

export async function getAuditLogs(params?: {
  page?: number;
  limit?: number;
  userId?: string;
  action?: string;
}) {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (params?.userId) where.userId = params.userId;
  if (params?.action) where.action = { contains: params.action, mode: "insensitive" };

  const [logs, total] = await Promise.all([
    db.auditLog.findMany({
      where,
      include: {
        user: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    db.auditLog.count({ where }),
  ]);

  return {
    logs,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}
