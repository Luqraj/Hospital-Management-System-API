/*
  Warnings:

  - A unique constraint covering the columns `[patientId]` on the table `Bill` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Bill_patientId_key" ON "Bill"("patientId");
