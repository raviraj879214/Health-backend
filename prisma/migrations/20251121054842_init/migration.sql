-- AlterTable
ALTER TABLE "Clinic" ADD COLUMN     "clinicUserId" INTEGER;

-- CreateTable
CREATE TABLE "ClinicUser" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "passwordHash" TEXT NOT NULL,
    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP(3),
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClinicUser_email_key" ON "ClinicUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicUser_resetToken_key" ON "ClinicUser"("resetToken");

-- AddForeignKey
ALTER TABLE "Clinic" ADD CONSTRAINT "Clinic_clinicUserId_fkey" FOREIGN KEY ("clinicUserId") REFERENCES "ClinicUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
