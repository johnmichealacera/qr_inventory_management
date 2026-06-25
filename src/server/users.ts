"use server";

import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/audit";
import { requireRole } from "@/lib/auth";
import { createUserSchema, updateUserSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function getUsers() {
  return db.user.findMany({
    include: { role: true },
    orderBy: { createdAt: "desc" },
  });
}

import { ROLES } from "@/lib/constants";

const ALL_ROLE_NAMES = Object.values(ROLES);

export async function getRoles() {
  await Promise.all(
    ALL_ROLE_NAMES.map((name) =>
      db.role.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  return db.role.findMany({ orderBy: { name: "asc" } });
}

export async function createUser(data: unknown) {
  const session = await requireRole(["Admin"]);
  const parsed = createUserSchema.parse(data);

  const existing = await db.user.findUnique({
    where: { username: parsed.username },
  });
  if (existing) throw new Error("Username already taken");

  const hashedPassword = await bcrypt.hash(parsed.password, 12);

  const user = await db.user.create({
    data: {
      name: parsed.name,
      username: parsed.username,
      password: hashedPassword,
      roleId: parsed.roleId,
      borrowerId: parsed.borrowerId || null,
    },
    include: { role: true },
  });

  await createAuditLog({
    userId: session.user.id,
    action: "CREATE_USER",
    entity: "User",
    entityId: user.id,
    details: `Created user: ${user.name} (${user.role.name})`,
  });

  revalidatePath("/users");
  return { id: user.id, name: user.name, username: user.username };
}

export async function updateUser(id: string, data: unknown) {
  const session = await requireRole(["Admin"]);
  const parsed = updateUserSchema.parse(data);

  const updateData: Record<string, unknown> = {};
  if (parsed.name) updateData.name = parsed.name;
  if (parsed.username) updateData.username = parsed.username;
  if (parsed.roleId) updateData.roleId = parsed.roleId;
  if (parsed.borrowerId !== undefined) updateData.borrowerId = parsed.borrowerId || null;
  if (parsed.password) {
    updateData.password = await bcrypt.hash(parsed.password, 12);
  }

  const user = await db.user.update({
    where: { id },
    data: updateData,
    include: { role: true },
  });

  await createAuditLog({
    userId: session.user.id,
    action: "UPDATE_USER",
    entity: "User",
    entityId: user.id,
    details: `Updated user: ${user.name}`,
  });

  revalidatePath("/users");
  return { id: user.id, name: user.name, username: user.username };
}

export async function deleteUser(id: string) {
  const session = await requireRole(["Admin"]);
  if (session.user.id === id) throw new Error("Cannot delete your own account");

  const user = await db.user.findUnique({ where: { id } });
  if (!user) throw new Error("User not found");

  await db.user.delete({ where: { id } });

  await createAuditLog({
    userId: session.user.id,
    action: "DELETE_USER",
    entity: "User",
    entityId: id,
    details: `Deleted user: ${user.name}`,
  });

  revalidatePath("/users");
}
