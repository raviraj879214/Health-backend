/*
  Warnings:

  - You are about to drop the `chat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `clinics` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."chat" DROP CONSTRAINT "chat_receiver_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."chat" DROP CONSTRAINT "chat_sender_id_fkey";

-- DropTable
DROP TABLE "public"."chat";

-- DropTable
DROP TABLE "public"."clinics";

-- CreateTable
CREATE TABLE "Clinic" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "imageUrl" TEXT,
    "priorityLevel" INTEGER NOT NULL DEFAULT 0,
    "promotionEnd" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Clinic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingPackage" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "priorityLevel" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ListingPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicListingOrder" (
    "id" SERIAL NOT NULL,
    "clinicId" INTEGER NOT NULL,
    "packageId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "stripePaymentId" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicListingOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClinicListingOrder_stripePaymentId_key" ON "ClinicListingOrder"("stripePaymentId");

-- AddForeignKey
ALTER TABLE "ClinicListingOrder" ADD CONSTRAINT "ClinicListingOrder_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicListingOrder" ADD CONSTRAINT "ClinicListingOrder_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "ListingPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
