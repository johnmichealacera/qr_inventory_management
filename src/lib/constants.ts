export const ROLES = {
  ADMIN: "Admin",
  STAFF: "Staff",
  AUDITOR: "Auditor",
} as const;

export type RoleName = (typeof ROLES)[keyof typeof ROLES];

export const TRANSACTION_TYPES = {
  IN: "IN",
  OUT: "OUT",
  RETURN: "RETURN",
} as const;

export const TRANSACTION_TYPE_LABELS: Record<string, string> = {
  IN: "Received",
  OUT: "Issued",
  RETURN: "Returned",
};

export const PAGE_SIZE = 20;
