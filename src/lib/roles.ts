import { ROLES } from "@/lib/constants";

/** Admin or Custodian — may create, update, and record transactions. */
export function canManageInventory(role?: string | null): boolean {
  return role === ROLES.ADMIN || role === ROLES.CUSTODIAN;
}

export function isAdminRole(role?: string | null): boolean {
  return role === ROLES.ADMIN;
}

export function isAuditorRole(role?: string | null): boolean {
  return role === ROLES.AUDITOR;
}
