import { db } from "@/lib/db";

interface AuditLogParams {
  userId: string;
  action: string;
  entity?: string;
  entityId?: string;
  details?: string;
}

export async function createAuditLog(params: AuditLogParams) {
  return db.auditLog.create({
    data: {
      userId: params.userId,
      action: params.action,
      entity: params.entity,
      entityId: params.entityId,
      details: params.details,
    },
  });
}
