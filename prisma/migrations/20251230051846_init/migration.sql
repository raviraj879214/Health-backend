-- AlterTable
ALTER TABLE "BoostPackage" ADD COLUMN     "description" TEXT,
ADD COLUMN     "placement" INTEGER NOT NULL DEFAULT 2;
