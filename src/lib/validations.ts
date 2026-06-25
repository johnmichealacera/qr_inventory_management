import { z } from "zod";
import { INVENTORY_TYPES, PERSON_TYPES } from "@/lib/constants";

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  roleId: z.string().min(1, "Role is required"),
  borrowerId: z.string().optional(),
});

export const createConsumableRequestSchema = z
  .object({
    itemId: z.string().optional(),
    customItemName: z.string().optional(),
    customDescription: z.string().optional(),
    quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
    notes: z.string().optional(),
  })
  .refine((data) => Boolean(data.itemId?.trim()) || Boolean(data.customItemName?.trim()), {
    message: "Select a consumable item or enter a custom item name",
    path: ["customItemName"],
  });

export const reviewConsumableRequestSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED", "FULFILLED"]),
  reviewNotes: z.string().optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  username: z.string().min(3).optional(),
  password: z.string().min(6).optional(),
  roleId: z.string().min(1).optional(),
  borrowerId: z.string().nullable().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
});

export const createItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  reorderLevel: z.coerce.number().int().min(0, "Must be 0 or greater").default(10),
  inventoryType: z
    .enum([INVENTORY_TYPES.BORROWABLE, INVENTORY_TYPES.CONSUMABLE])
    .default(INVENTORY_TYPES.BORROWABLE),
});

export const updateItemSchema = createItemSchema.partial();

export const transactionSchema = z
  .object({
    itemId: z.string().min(1, "Item is required"),
    type: z.enum(["IN", "OUT", "RETURN"], {
      message: "Transaction type is required",
    }),
    quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
    notes: z.string().optional(),
    borrowerId: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.type === "IN") return true;
      return Boolean(data.borrowerId?.trim());
    },
    {
      message: "Requester is required for issuance, release, or return",
      path: ["borrowerId"],
    }
  );

export const createBorrowerSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  idNumber: z.string().min(1, "ID number is required"),
  personType: z.enum([PERSON_TYPES.STAFF, PERSON_TYPES.FACULTY]),
  department: z.string().min(1, "Department is required"),
  officeUnit: z.string().optional(),
  contactPhone: z.string().optional(),
});

export const updateBorrowerSchema = createBorrowerSchema.partial();

export const reportFilterSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  itemId: z.string().optional(),
  type: z.enum(["IN", "OUT", "RETURN"]).optional(),
  borrowerId: z.string().optional(),
  inventoryType: z
    .enum([INVENTORY_TYPES.BORROWABLE, INVENTORY_TYPES.CONSUMABLE])
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
export type TransactionInput = z.infer<typeof transactionSchema>;
export type ReportFilterInput = z.infer<typeof reportFilterSchema>;
export type CreateBorrowerInput = z.infer<typeof createBorrowerSchema>;
export type UpdateBorrowerInput = z.infer<typeof updateBorrowerSchema>;
export type CreateConsumableRequestInput = z.infer<typeof createConsumableRequestSchema>;
export type ReviewConsumableRequestInput = z.infer<typeof reviewConsumableRequestSchema>;
