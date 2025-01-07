/*
  Warnings:

  - You are about to drop the column `date` on the `Bill` table. All the data in the column will be lost.
  - You are about to drop the column `billId` on the `Prescription` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[prescriptionId]` on the table `Bill` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `prescriptionId` to the `Bill` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Prescription" DROP CONSTRAINT "Prescription_billId_fkey";

-- AlterTable
ALTER TABLE "Bill" DROP COLUMN "date",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "prescriptionId" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'UNPAID';

-- AlterTable
ALTER TABLE "Prescription" DROP COLUMN "billId";

-- CreateIndex
CREATE UNIQUE INDEX "Bill_prescriptionId_key" ON "Bill"("prescriptionId");

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "Prescription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
