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

  const facultyRole = await prisma.role.upsert({
    where: { name: "Faculty" },
    update: {},
    create: { name: "Faculty" },
  });

  const staffRole = await prisma.role.upsert({
    where: { name: "Staff" },
    update: {},
    create: { name: "Staff" },
  });

  const gsoOfficerRole = await prisma.role.upsert({
    where: { name: "GSO Officer" },
    update: {},
    create: { name: "GSO Officer" },
  });

  console.log("Roles ready:", {
    adminRole,
    custodianRole,
    auditorRole,
    facultyRole,
    staffRole,
    gsoOfficerRole,
  });

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
        name: "GSO Supplies Custodian",
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
      name: "GSO Supplies Custodian",
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

  const legacyCategoryNames = [
    "Criminology — Uniforms & Gear",
    "Criminology — Training Equipment",
    "Criminology — Forensic Supplies",
    "Criminology — Documentation",
  ];

  const legacyCategories = await prisma.category.findMany({
    where: { name: { in: legacyCategoryNames } },
    select: { id: true },
  });
  const legacyCategoryIds = legacyCategories.map((c) => c.id);

  if (legacyCategoryIds.length > 0) {
    const legacyItems = await prisma.item.findMany({
      where: { categoryId: { in: legacyCategoryIds } },
      select: { id: true },
    });
    const legacyItemIds = legacyItems.map((i) => i.id);
    if (legacyItemIds.length > 0) {
      await prisma.transaction.deleteMany({ where: { itemId: { in: legacyItemIds } } });
      await prisma.qRCode.deleteMany({ where: { itemId: { in: legacyItemIds } } });
      await prisma.item.deleteMany({ where: { id: { in: legacyItemIds } } });
      console.log(`Removed ${legacyItemIds.length} legacy catalog item(s)`);
    }
    await prisma.category.deleteMany({ where: { id: { in: legacyCategoryIds } } });
    console.log("Removed legacy Criminology categories");
  }

  const borrowableItems = await prisma.item.findMany({
    where: { inventoryType: "BORROWABLE" },
    select: { id: true },
  });
  if (borrowableItems.length > 0) {
    const borrowableIds = borrowableItems.map((i) => i.id);
    await prisma.transaction.deleteMany({ where: { itemId: { in: borrowableIds } } });
    await prisma.qRCode.deleteMany({ where: { itemId: { in: borrowableIds } } });
    await prisma.item.deleteMany({ where: { id: { in: borrowableIds } } });
    console.log(`Removed ${borrowableIds.length} borrowable item(s) from seed cleanup`);
  }

  const categories = [
    "Office Supplies",
    "Paper & Documentation",
    "Writing Instruments",
    "Cleaning & Janitorial Supplies",
    "IT & Electrical Supplies",
  ];

  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log("Categories:", categories);

  const officeCat = await prisma.category.findUnique({ where: { name: "Office Supplies" } });
  const paperCat = await prisma.category.findUnique({
    where: { name: "Paper & Documentation" },
  });
  const writingCat = await prisma.category.findUnique({
    where: { name: "Writing Instruments" },
  });
  const cleaningCat = await prisma.category.findUnique({
    where: { name: "Cleaning & Janitorial Supplies" },
  });
  const itCat = await prisma.category.findUnique({
    where: { name: "IT & Electrical Supplies" },
  });

  if (officeCat && paperCat && writingCat && cleaningCat && itCat) {
    const consumableItems = [
      {
        name: "Bond paper (A4, 80gsm, ream)",
        description: "Standard copy paper for offices and faculty rooms",
        categoryId: paperCat.id,
        reorderLevel: 40,
        initialStock: 120,
      },
      {
        name: "Long bond paper (8.5×13, ream)",
        description: "Legal-size paper for official forms",
        categoryId: paperCat.id,
        reorderLevel: 20,
        initialStock: 60,
      },
      {
        name: "Document envelope (A4, brown)",
        description: "For routing internal and external mail",
        categoryId: paperCat.id,
        reorderLevel: 200,
        initialStock: 500,
      },
      {
        name: "Ballpoint pen (black, box of 12)",
        description: "Standard issue writing pen",
        categoryId: writingCat.id,
        reorderLevel: 15,
        initialStock: 48,
      },
      {
        name: "Whiteboard marker (assorted, set of 4)",
        description: "For classrooms and meeting rooms",
        categoryId: writingCat.id,
        reorderLevel: 10,
        initialStock: 24,
      },
      {
        name: "Correction tape",
        description: "Office correction supply",
        categoryId: writingCat.id,
        reorderLevel: 12,
        initialStock: 30,
      },
      {
        name: "Stapler staples (standard, box)",
        description: "Refill staples for desk staplers",
        categoryId: officeCat.id,
        reorderLevel: 10,
        initialStock: 25,
      },
      {
        name: "Paper clips (box)",
        description: "Metal clips for document bundling",
        categoryId: officeCat.id,
        reorderLevel: 8,
        initialStock: 20,
      },
      {
        name: "Plastic folder (long, clear)",
        description: "Document storage for faculty and staff",
        categoryId: officeCat.id,
        reorderLevel: 30,
        initialStock: 80,
      },
      {
        name: "Glue stick",
        description: "General office adhesive",
        categoryId: officeCat.id,
        reorderLevel: 15,
        initialStock: 36,
      },
      {
        name: "Disinfectant spray (500ml)",
        description: "Surface cleaning for offices and stockroom",
        categoryId: cleaningCat.id,
        reorderLevel: 6,
        initialStock: 18,
      },
      {
        name: "Trash bags (large, roll)",
        description: "Janitorial waste bags",
        categoryId: cleaningCat.id,
        reorderLevel: 5,
        initialStock: 12,
      },
      {
        name: "Hand soap refill (liquid)",
        description: "Restroom and pantry dispensers",
        categoryId: cleaningCat.id,
        reorderLevel: 8,
        initialStock: 20,
      },
      {
        name: "USB flash drive (32GB)",
        description: "For file transfer and backup",
        categoryId: itCat.id,
        reorderLevel: 5,
        initialStock: 15,
      },
      {
        name: "HDMI cable (6ft)",
        description: "For projectors and displays",
        categoryId: itCat.id,
        reorderLevel: 4,
        initialStock: 10,
      },
    ];

    for (const itemData of consumableItems) {
      const existing = await prisma.item.findFirst({
        where: { name: itemData.name },
      });

      if (!existing) {
        const { initialStock, ...createData } = itemData;
        const item = await prisma.item.create({
          data: {
            ...createData,
            inventoryType: "CONSUMABLE",
          },
        });

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
            quantity: initialStock,
            notes: "Initial stock (seed)",
          },
        });

        console.log(`Created consumable: ${item.name} (stock: ${initialStock})`);
      }
    }
  }

  const borrowerSeeds = [
    {
      fullName: "Prof. Elena Reyes",
      idNumber: "FAC-GSO-012",
      personType: "FACULTY" as const,
      department: "General Supplies Office",
      officeUnit: null,
      contactPhone: "+639170000099",
    },
    {
      fullName: "Maria Lopez",
      idNumber: "STAFF-GSO-001",
      personType: "STAFF" as const,
      department: "General Supplies Office",
      officeUnit: "Receiving desk",
      contactPhone: "+639170000088",
    },
  ];

  await prisma.borrower.deleteMany({
    where: { idNumber: { in: ["CRIM-2024-001", "CRIM-2024-014"] } },
  });

  for (const b of borrowerSeeds) {
    await prisma.borrower.upsert({
      where: { idNumber: b.idNumber },
      update: {
        fullName: b.fullName,
        personType: b.personType,
        department: b.department,
        officeUnit: b.officeUnit,
        contactPhone: b.contactPhone,
      },
      create: b,
    });
  }
  console.log("Requesters (sample):", borrowerSeeds.map((b) => b.idNumber).join(", "));

  const facultyBorrower = await prisma.borrower.findUnique({
    where: { idNumber: "FAC-GSO-012" },
  });
  const staffBorrower = await prisma.borrower.findUnique({
    where: { idNumber: "STAFF-GSO-001" },
  });

  if (facultyBorrower) {
    await prisma.user.upsert({
      where: { username: "faculty" },
      update: { roleId: facultyRole.id, borrowerId: facultyBorrower.id },
      create: {
        name: "Prof. Elena Reyes",
        username: "faculty",
        password: hashedPassword,
        roleId: facultyRole.id,
        borrowerId: facultyBorrower.id,
      },
    });
  }

  if (staffBorrower) {
    await prisma.user.upsert({
      where: { username: "staff" },
      update: { roleId: staffRole.id, borrowerId: staffBorrower.id },
      create: {
        name: "Maria Lopez",
        username: "staff",
        password: hashedPassword,
        roleId: staffRole.id,
        borrowerId: staffBorrower.id,
      },
    });
  }

  await prisma.user.upsert({
    where: { username: "gso" },
    update: { roleId: gsoOfficerRole.id },
    create: {
      name: "GSO Officer",
      username: "gso",
      password: hashedPassword,
      roleId: gsoOfficerRole.id,
    },
  });

  console.log("Seed completed successfully!");
  console.log("\nDefault login credentials:");
  console.log("  Admin:       admin / password123");
  console.log("  Custodian:   custodian / password123");
  console.log("  GSO Officer: gso / password123");
  console.log("  Auditor:     auditor / password123");
  console.log("  Faculty:     faculty / password123");
  console.log("  Staff:       staff / password123");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
