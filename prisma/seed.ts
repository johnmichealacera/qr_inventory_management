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

  const custodianRole = await prisma.role.upsert({
    where: { name: "Custodian" },
    update: {},
    create: { name: "Custodian" },
  });

  const auditorRole = await prisma.role.upsert({
    where: { name: "Auditor" },
    update: {},
    create: { name: "Auditor" },
  });

  const legacyStaffRole = await prisma.role.findUnique({ where: { name: "Staff" } });
  if (legacyStaffRole) {
    await prisma.user.updateMany({
      where: { roleId: legacyStaffRole.id },
      data: { roleId: custodianRole.id },
    });
    await prisma.role.delete({ where: { id: legacyStaffRole.id } });
    console.log("Migrated legacy Staff role to Custodian");
  }

  console.log("Roles ready:", { adminRole, custodianRole, auditorRole });

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

  const existingStaffUser = await prisma.user.findUnique({ where: { username: "staff" } });
  const existingCustodianUser = await prisma.user.findUnique({ where: { username: "custodian" } });

  if (existingStaffUser && !existingCustodianUser) {
    await prisma.user.update({
      where: { id: existingStaffUser.id },
      data: {
        username: "custodian",
        name: "Equipment Custodian",
        roleId: custodianRole.id,
      },
    });
    console.log("Renamed legacy user staff → custodian");
  } else if (existingStaffUser && existingCustodianUser) {
    await prisma.user.delete({ where: { id: existingStaffUser.id } });
    console.log("Removed duplicate legacy staff user (custodian already exists)");
  }

  const custodian = await prisma.user.upsert({
    where: { username: "custodian" },
    update: { roleId: custodianRole.id },
    create: {
      name: "Equipment Custodian",
      username: "custodian",
      password: hashedPassword,
      roleId: custodianRole.id,
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

  console.log("Users:", {
    admin: admin.username,
    custodian: custodian.username,
    auditor: auditor.username,
  });

  const categories = [
    "Criminology — Uniforms & Gear",
    "Criminology — Training Equipment",
    "Criminology — Forensic Supplies",
    "Criminology — Documentation",
  ];

  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log("Categories:", categories);

  const uniformCat = await prisma.category.findUnique({
    where: { name: "Criminology — Uniforms & Gear" },
  });
  const trainingCat = await prisma.category.findUnique({
    where: { name: "Criminology — Training Equipment" },
  });
  const forensicCat = await prisma.category.findUnique({
    where: { name: "Criminology — Forensic Supplies" },
  });

  if (uniformCat && trainingCat && forensicCat) {
    const sampleItems = [
      {
        name: "Tactical belt (standard issue)",
        description: "College of Criminology equipment room",
        categoryId: uniformCat.id,
        reorderLevel: 15,
      },
      {
        name: "Evidence collection kit",
        description: "Sealed consumables for lab practicum",
        categoryId: forensicCat.id,
        reorderLevel: 8,
      },
      {
        name: "Handcuff training set (practice)",
        description: "Drill hall issuance",
        categoryId: trainingCat.id,
        reorderLevel: 6,
      },
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
            quantity: 50,
            notes: "Initial stock (seed)",
          },
        });

        console.log(`Created item: ${item.name}`);
      }
    }
  }

  const borrowerSeeds = [
    {
      fullName: "Ana Maria Santos",
      studentId: "CRIM-2024-001",
      programSection: "BSCrim 4A",
      contactPhone: "+639170000001",
    },
    {
      fullName: "Juan Dela Cruz",
      studentId: "CRIM-2024-014",
      programSection: "BSCrim 3B",
      contactPhone: "+639170000002",
    },
  ];

  for (const b of borrowerSeeds) {
    await prisma.borrower.upsert({
      where: { studentId: b.studentId },
      update: {
        fullName: b.fullName,
        programSection: b.programSection,
        contactPhone: b.contactPhone,
      },
      create: b,
    });
  }
  console.log("Borrowers (sample):", borrowerSeeds.map((b) => b.studentId).join(", "));

  console.log("Seed completed successfully!");
  console.log("\nDefault login credentials:");
  console.log("  Admin:     admin / password123");
  console.log("  Custodian: custodian / password123");
  console.log("  Auditor:   auditor / password123");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
