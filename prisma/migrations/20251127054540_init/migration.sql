/*
  Warnings:

  - You are about to drop the `ClinicSurgariesImages` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "ClinicSurgeryImage" ADD COLUMN     "surgeryId" TEXT;

-- DropTable
DROP TABLE "public"."ClinicSurgariesImages";
