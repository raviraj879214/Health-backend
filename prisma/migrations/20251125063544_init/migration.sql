/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `Clinic` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `ClinicImages` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `ClinicListingOrder` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `ClinicUser` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `ListingPackage` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `Patients` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `Specialty` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `SpecialtyType` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Clinic_uuid_key" ON "Clinic"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicImages_uuid_key" ON "ClinicImages"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicListingOrder_uuid_key" ON "ClinicListingOrder"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicUser_uuid_key" ON "ClinicUser"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "ListingPackage_uuid_key" ON "ListingPackage"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_uuid_key" ON "Notification"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Patients_uuid_key" ON "Patients"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Specialty_uuid_key" ON "Specialty"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "SpecialtyType_uuid_key" ON "SpecialtyType"("uuid");
