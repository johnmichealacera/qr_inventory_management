export const ROLES = {
  ADMIN: "Admin",
  CUSTODIAN: "Custodian",
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

/** Study scope: inventory limited to College of Criminology equipment */
export const EQUIPMENT_PROGRAM_CRIMINOLOGY = "CRIMINOLOGY" as const;

export const PAGE_SIZE = 20;
