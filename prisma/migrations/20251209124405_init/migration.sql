/*
  Warnings:

  - You are about to drop the `boost_packages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `clinic_boosts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `clinic_packages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."clinic_boosts" DROP CONSTRAINT "clinic_boosts_boostPackageId_fkey";

-- DropForeignKey
ALTER TABLE "public"."clinic_boosts" DROP CONSTRAINT "clinic_boosts_clinicPackageId_fkey";

-- DropTable
DROP TABLE "public"."boost_packages";

-- DropTable
DROP TABLE "public"."clinic_boosts";

-- DropTable
DROP TABLE "public"."clinic_packages";

-- CreateTable
CREATE TABLE "ClinicPackage" (
    "id" UUID NOT NULL,
    "clinicId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoostPackage" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BoostPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicBoost" (
    "id" UUID NOT NULL,
    "clinicPackageId" UUID NOT NULL,
    "boostPackageId" UUID NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicBoost_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClinicBoost" ADD CONSTRAINT "ClinicBoost_clinicPackageId_fkey" FOREIGN KEY ("clinicPackageId") REFERENCES "ClinicPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicBoost" ADD CONSTRAINT "ClinicBoost_boostPackageId_fkey" FOREIGN KEY ("boostPackageId") REFERENCES "BoostPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
