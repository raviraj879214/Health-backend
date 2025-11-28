/*
  Warnings:

  - You are about to drop the column `Images` on the `ClinicAccreditation` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `ClinicAccreditation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[clinicuuid,accreditationId]` on the table `ClinicAccreditation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accreditationId` to the `ClinicAccreditation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ClinicAccreditation" DROP COLUMN "Images",
DROP COLUMN "text",
ADD COLUMN     "accreditationId" INTEGER NOT NULL,
ADD COLUMN     "clinicuuid" TEXT;

-- CreateTable
CREATE TABLE "Accreditation" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "image" TEXT,
    "name" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Accreditation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Accreditation_uuid_key" ON "Accreditation"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicAccreditation_clinicuuid_accreditationId_key" ON "ClinicAccreditation"("clinicuuid", "accreditationId");

-- AddForeignKey
ALTER TABLE "ClinicAccreditation" ADD CONSTRAINT "ClinicAccreditation_accreditationId_fkey" FOREIGN KEY ("accreditationId") REFERENCES "Accreditation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
