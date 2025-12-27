-- AlterTable
ALTER TABLE "PatientQuery" ADD COLUMN     "countryCode" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "status" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "subject" TEXT,
ADD COLUMN     "telegramUsername" TEXT,
ADD COLUMN     "whatsappNumber" TEXT;
