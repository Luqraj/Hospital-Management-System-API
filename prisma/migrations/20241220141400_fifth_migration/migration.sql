/*
  Warnings:

  - You are about to drop the column `status` on the `Bill` table. All the data in the column will be lost.
  - Added the required column `billId` to the `Prescription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `Prescription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" ALTER COLUMN "date" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Bill" DROP COLUMN "status",
ALTER COLUMN "date" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Prescription" ADD COLUMN     "billId" TEXT NOT NULL,
ADD COLUMN     "date" TEXT NOT NULL,
ALTER COLUMN "medication" SET DATA TYPE VARCHAR(255);

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_billId_fkey" FOREIGN KEY ("billId") REFERENCES "Bill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
