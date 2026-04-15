-- AlterTable
ALTER TABLE "items" ADD COLUMN     "equipmentProgram" TEXT NOT NULL DEFAULT 'CRIMINOLOGY';

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "borrowerId" TEXT;

-- CreateTable
CREATE TABLE "borrowers" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "programSection" TEXT,
    "contactPhone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "borrowers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "borrowers_studentId_key" ON "borrowers"("studentId");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_borrowerId_fkey" FOREIGN KEY ("borrowerId") REFERENCES "borrowers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
