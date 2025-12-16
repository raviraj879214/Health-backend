/*
  Warnings:

  - You are about to drop the column `description` on the `ClinicPackage` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `ClinicPackage` table. All the data in the column will be lost.
  - You are about to drop the column `actualprice` on the `Procedure` table. All the data in the column will be lost.
  - You are about to drop the column `briefdescription` on the `Procedure` table. All the data in the column will be lost.
  - You are about to drop the column `discountedprice` on the `Procedure` table. All the data in the column will be lost.
  - You are about to drop the column `fulldescription` on the `Procedure` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ClinicPackage" DROP COLUMN "description",
DROP COLUMN "price",
ADD COLUMN     "actualprice" TEXT,
ADD COLUMN     "briefdescription" TEXT,
ADD COLUMN     "discountedprice" TEXT,
ADD COLUMN     "fulldescription" TEXT;

-- AlterTable
ALTER TABLE "Procedure" DROP COLUMN "actualprice",
DROP COLUMN "briefdescription",
DROP COLUMN "discountedprice",
DROP COLUMN "fulldescription",
ADD COLUMN     "description" TEXT;
