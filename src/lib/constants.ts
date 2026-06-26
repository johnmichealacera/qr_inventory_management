export const ROLES = {
  ADMIN: "Admin",
  CUSTODIAN: "Custodian",
  AUDITOR: "Auditor",
  GSO_OFFICER: "GSO Officer",
  FACULTY: "Faculty",
  STAFF: "Staff",
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
  STAFF: "STAFF",
  FACULTY: "FACULTY",
} as const;

export type PersonTypeName = (typeof PERSON_TYPES)[keyof typeof PERSON_TYPES];

export const PERSON_TYPE_LABELS: Record<PersonTypeName, string> = {
  STAFF: "Staff",
  FACULTY: "Faculty",
};

export const CONSUMABLE_REQUEST_STATUSES = {
  PENDING: "PENDING",
  CANVASSING: "CANVASSING",
  FOR_VOUCHER: "FOR_VOUCHER",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  FULFILLED: "FULFILLED",
} as const;

export type ConsumableRequestStatusName =
  (typeof CONSUMABLE_REQUEST_STATUSES)[keyof typeof CONSUMABLE_REQUEST_STATUSES];

export const CONSUMABLE_REQUEST_STATUS_LABELS: Record<ConsumableRequestStatusName, string> = {
  PENDING: "Pending review",
  CANVASSING: "For canvassing",
  FOR_VOUCHER: "For voucher",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  FULFILLED: "Fulfilled",
};

/** Allowed status transitions for consumable purchase requests */
export const CONSUMABLE_REQUEST_TRANSITIONS: Record<
  ConsumableRequestStatusName,
  ConsumableRequestStatusName[]
> = {
  PENDING: ["CANVASSING", "FOR_VOUCHER", "APPROVED", "REJECTED"],
  CANVASSING: ["FOR_VOUCHER", "REJECTED"],
  FOR_VOUCHER: ["APPROVED", "REJECTED"],
  APPROVED: ["FULFILLED"],
  REJECTED: [],
  FULFILLED: [],
};

/** Study scope: inventory limited to College of Criminology equipment */
export const EQUIPMENT_PROGRAM_CRIMINOLOGY = "CRIMINOLOGY" as const;

export const PAGE_SIZE = 20;

export const CONSUMABLES_PAGE_SIZE = 10;

export function formatRequesterLine(requester: {
  fullName: string;
  idNumber: string;
  personType: string;
  department: string;
}): string {
  const role = PERSON_TYPE_LABELS[requester.personType as PersonTypeName] ?? requester.personType;
  return `${requester.fullName} (${requester.idNumber}) · ${role} · ${requester.department}`;
}
