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

export const CONSUMABLE_TRANSACTION_TYPE_LABELS: Record<string, string> = {
  IN: "Received (stock in)",
  OUT: "Released / consumed",
};

export const INVENTORY_TYPES = {
  BORROWABLE: "BORROWABLE",
  CONSUMABLE: "CONSUMABLE",
} as const;

export type InventoryTypeName = (typeof INVENTORY_TYPES)[keyof typeof INVENTORY_TYPES];

export const INVENTORY_TYPE_LABELS: Record<InventoryTypeName, string> = {
  BORROWABLE: "Borrowable",
  CONSUMABLE: "Consumable",
};

export const PERSON_TYPES = {
  STUDENT: "STUDENT",
  STAFF: "STAFF",
  FACULTY: "FACULTY",
} as const;

export type PersonTypeName = (typeof PERSON_TYPES)[keyof typeof PERSON_TYPES];

export const PERSON_TYPE_LABELS: Record<PersonTypeName, string> = {
  STUDENT: "Student",
  STAFF: "Staff",
  FACULTY: "Faculty",
};

/** Study scope: inventory limited to College of Criminology equipment */
export const EQUIPMENT_PROGRAM_CRIMINOLOGY = "CRIMINOLOGY" as const;

export const PAGE_SIZE = 20;

export function formatRequesterLine(requester: {
  fullName: string;
  studentId: string;
  personType: string;
  department: string;
}): string {
  const role = PERSON_TYPE_LABELS[requester.personType as PersonTypeName] ?? requester.personType;
  return `${requester.fullName} (${requester.studentId}) · ${role} · ${requester.department}`;
}
