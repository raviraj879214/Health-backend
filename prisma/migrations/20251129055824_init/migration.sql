/*
  Warnings:

  - You are about to drop the column `clinicUuid` on the `ClinicDescription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ClinicDescription" DROP COLUMN "clinicUuid",
ADD COLUMN     "clinicuuid" TEXT;
