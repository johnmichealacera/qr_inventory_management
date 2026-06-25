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

/** Faculty or Staff — self-service consumable requesters. */
export function isRequesterRole(role?: string | null): boolean {
  return role === ROLES.FACULTY || role === ROLES.STAFF;
}

export function canSubmitConsumableRequest(role?: string | null): boolean {
  return isRequesterRole(role);
}

export function canReviewConsumableRequests(role?: string | null): boolean {
  return role === ROLES.ADMIN || role === ROLES.CUSTODIAN;
}

export function canViewConsumables(role?: string | null): boolean {
  if (!role) return false;
  return (
    role === ROLES.ADMIN ||
    role === ROLES.CUSTODIAN ||
    role === ROLES.AUDITOR ||
    isRequesterRole(role)
  );
}
