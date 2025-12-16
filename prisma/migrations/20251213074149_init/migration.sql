/*
  Warnings:

  - Added the required column `doctorId` to the `PackageDoctor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PackageDoctor" DROP COLUMN "doctorId",
ADD COLUMN     "doctorId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "PackageDoctor" ADD CONSTRAINT "PackageDoctor_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
