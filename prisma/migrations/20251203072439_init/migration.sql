/*
  Warnings:

  - A unique constraint covering the columns `[doctorUuid,treatmentid]` on the table `DoctorTreatment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DoctorTreatment_doctorUuid_treatmentid_key" ON "DoctorTreatment"("doctorUuid", "treatmentid");
