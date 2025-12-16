/*
  Warnings:

  - The primary key for the `Specialty` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `status` on the `Specialty` table. All the data in the column will be lost.
  - You are about to drop the column `typeId` on the `Specialty` table. All the data in the column will be lost.
  - You are about to drop the column `uuid` on the `Specialty` table. All the data in the column will be lost.
  - You are about to drop the `SpecialtyType` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Specialty` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `id` on the `Specialty` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."Specialty" DROP CONSTRAINT "Specialty_typeId_fkey";

-- DropIndex
DROP INDEX "public"."Specialty_uuid_key";

-- AlterTable
ALTER TABLE "Specialty" DROP CONSTRAINT "Specialty_pkey",
DROP COLUMN "status",
DROP COLUMN "typeId",
DROP COLUMN "uuid",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "description" SET DATA TYPE TEXT,
ADD CONSTRAINT "Specialty_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "public"."SpecialtyType";

-- CreateTable
CREATE TABLE "DoctorSpecialty" (
    "id" UUID NOT NULL,
    "doctorUuid" UUID NOT NULL,
    "specialtyId" UUID,
    "suggestedCategoryId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DoctorSpecialty_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DoctorSpecialty_doctorUuid_specialtyId_key" ON "DoctorSpecialty"("doctorUuid", "specialtyId");

-- CreateIndex
CREATE UNIQUE INDEX "Specialty_name_key" ON "Specialty"("name");

-- AddForeignKey
ALTER TABLE "DoctorSpecialty" ADD CONSTRAINT "DoctorSpecialty_doctorUuid_fkey" FOREIGN KEY ("doctorUuid") REFERENCES "Doctor"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorSpecialty" ADD CONSTRAINT "DoctorSpecialty_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "Specialty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorSpecialty" ADD CONSTRAINT "DoctorSpecialty_suggestedCategoryId_fkey" FOREIGN KEY ("suggestedCategoryId") REFERENCES "SpecializationRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
