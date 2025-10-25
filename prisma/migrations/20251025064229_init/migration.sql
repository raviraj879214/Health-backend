-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "uuid" UUID NOT NULL DEFAULT gen_random_uuid();
