-- AlterTable
ALTER TABLE "Clinic" ADD COLUMN     "telegramNumber" TEXT,
ADD COLUMN     "whatsappNumber" TEXT,
ALTER COLUMN "status" SET DEFAULT '0';
