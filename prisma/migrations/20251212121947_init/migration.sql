/*
  Warnings:

  - Added the required column `packageId` to the `PackageProcedure` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PackageProcedure" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "packageId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "PackageProcedure" ADD CONSTRAINT "PackageProcedure_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "ClinicPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
