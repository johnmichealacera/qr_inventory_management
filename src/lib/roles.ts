import { ROLES } from "@/lib/constants";

/** Admin or Custodian — full borrowable inventory and transactions. */
export function canManageInventory(role?: string | null): boolean {
  return role === ROLES.ADMIN || role === ROLES.CUSTODIAN;
}

/** Admin, Custodian, or GSO Officer — may add and edit consumable catalog items. */
export function canManageConsumables(role?: string | null): boolean {
  return (
    role === ROLES.ADMIN ||
    role === ROLES.CUSTODIAN ||
    role === ROLES.GSO_OFFICER
  );
}

export function isGsoOfficerRole(role?: string | null): boolean {
  return role === ROLES.GSO_OFFICER;
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
  return (
    role === ROLES.ADMIN ||
    role === ROLES.CUSTODIAN ||
    role === ROLES.GSO_OFFICER
  );
}

export function canViewConsumables(role?: string | null): boolean {
  if (!role) return false;
  return (
    role === ROLES.ADMIN ||
    role === ROLES.CUSTODIAN ||
    role === ROLES.GSO_OFFICER ||
    role === ROLES.AUDITOR ||
    isRequesterRole(role)
  );
}

export function canViewReleaseLog(role?: string | null): boolean {
  return role === ROLES.ADMIN || role === ROLES.CUSTODIAN;
}

/** Admin or Custodian — QR scanner and stock movements at the desk. */
export function canUseQrScanner(role?: string | null): boolean {
  return canManageInventory(role);
}
