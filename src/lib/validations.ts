import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  roleId: z.string().min(1, "Role is required"),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  username: z.string().min(3).optional(),
  password: z.string().min(6).optional(),
  roleId: z.string().min(1).optional(),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
});

export const createItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  reorderLevel: z.coerce.number().int().min(0, "Must be 0 or greater").default(10),
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
      message: "Borrower (student) is required for issuance and return",
      path: ["borrowerId"],
    }
  );

export const createBorrowerSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  studentId: z.string().min(1, "Student ID is required"),
  programSection: z.string().optional(),
  contactPhone: z.string().optional(),
});

export const updateBorrowerSchema = createBorrowerSchema.partial();

export const reportFilterSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  itemId: z.string().optional(),
  type: z.enum(["IN", "OUT", "RETURN"]).optional(),
  borrowerId: z.string().optional(),
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
