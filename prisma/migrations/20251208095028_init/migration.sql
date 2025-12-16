/*
  Warnings:

  - A unique constraint covering the columns `[clinicUuid]` on the table `ClinicDoctorAddress` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."ClinicDoctorAddress_clinicUuid_doctorUuid_key";

-- CreateIndex
CREATE UNIQUE INDEX "ClinicDoctorAddress_clinicUuid_key" ON "ClinicDoctorAddress"("clinicUuid");
