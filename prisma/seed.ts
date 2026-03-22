import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  const adminRole = await prisma.role.upsert({
    where: { name: "Admin" },
    update: {},
    create: { name: "Admin" },
  });

  const staffRole = await prisma.role.upsert({
    where: { name: "Staff" },
    update: {},
    create: { name: "Staff" },
  });

  const auditorRole = await prisma.role.upsert({
    where: { name: "Auditor" },
    update: {},
    create: { name: "Auditor" },
  });

  console.log("Roles created:", { adminRole, staffRole, auditorRole });

  const hashedPassword = await bcrypt.hash("password123", 12);

  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      name: "System Administrator",
      username: "admin",
      password: hashedPassword,
      roleId: adminRole.id,
    },
  });

  const staff = await prisma.user.upsert({
    where: { username: "staff" },
    update: {},
    create: {
      name: "Staff User",
      username: "staff",
      password: hashedPassword,
      roleId: staffRole.id,
    },
  });

  const auditor = await prisma.user.upsert({
    where: { username: "auditor" },
    update: {},
    create: {
      name: "Auditor User",
      username: "auditor",
      password: hashedPassword,
      roleId: auditorRole.id,
    },
  });

  console.log("Users created:", {
    admin: admin.username,
    staff: staff.username,
    auditor: auditor.username,
  });

  const categories = [
    "Office Supplies",
    "Cleaning Supplies",
    "Electronics",
    "Furniture",
    "Paper Products",
  ];

  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log("Categories created:", categories);

  const officeSupplies = await prisma.category.findUnique({
    where: { name: "Office Supplies" },
  });
  const paperProducts = await prisma.category.findUnique({
    where: { name: "Paper Products" },
  });
  const electronics = await prisma.category.findUnique({
    where: { name: "Electronics" },
  });

  if (officeSupplies && paperProducts && electronics) {
    const sampleItems = [
      { name: "Ballpoint Pen (Blue)", description: "Standard blue ballpoint pen", categoryId: officeSupplies.id, reorderLevel: 50 },
      { name: "Stapler", description: "Heavy-duty desk stapler", categoryId: officeSupplies.id, reorderLevel: 10 },
      { name: "A4 Bond Paper", description: "Short bond paper, 80gsm, 500 sheets per ream", categoryId: paperProducts.id, reorderLevel: 20 },
      { name: "Legal Pad", description: "Yellow ruled legal pad", categoryId: paperProducts.id, reorderLevel: 30 },
      { name: "USB Flash Drive 32GB", description: "USB 3.0 flash drive", categoryId: electronics.id, reorderLevel: 5 },
    ];

    for (const itemData of sampleItems) {
      const existing = await prisma.item.findFirst({
        where: { name: itemData.name },
      });

      if (!existing) {
        const item = await prisma.item.create({ data: itemData });

        await prisma.qRCode.create({
          data: {
            itemId: item.id,
            value: `INV-${item.id}`,
          },
        });

        await prisma.transaction.create({
          data: {
            itemId: item.id,
            userId: admin.id,
            type: "IN",
            quantity: 100,
            notes: "Initial stock",
          },
        });

        console.log(`Created item: ${item.name}`);
      }
    }
  }

  console.log("Seed completed successfully!");
  console.log("\nDefault login credentials:");
  console.log("  Admin:   admin / password123");
  console.log("  Staff:   staff / password123");
  console.log("  Auditor: auditor / password123");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
