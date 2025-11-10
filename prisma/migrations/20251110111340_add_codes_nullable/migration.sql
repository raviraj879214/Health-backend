/*
  Warnings:

  - A unique constraint covering the columns `[clinic_code]` on the table `Clinic` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cliniclistingorder]` on the table `ClinicListingOrder` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[listinfpackage_code]` on the table `ListingPackage` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Clinic" ADD COLUMN     "clinic_code" TEXT,
ADD COLUMN     "uuid" UUID NOT NULL DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "ClinicListingOrder" ADD COLUMN     "cliniclistingorder" TEXT,
ADD COLUMN     "uuid" UUID NOT NULL DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "ListingPackage" ADD COLUMN     "listinfpackage_code" TEXT,
ADD COLUMN     "uuid" UUID NOT NULL DEFAULT gen_random_uuid();

-- CreateIndex
CREATE UNIQUE INDEX "Clinic_clinic_code_key" ON "Clinic"("clinic_code");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicListingOrder_cliniclistingorder_key" ON "ClinicListingOrder"("cliniclistingorder");

-- CreateIndex
CREATE UNIQUE INDEX "ListingPackage_listinfpackage_code_key" ON "ListingPackage"("listinfpackage_code");
