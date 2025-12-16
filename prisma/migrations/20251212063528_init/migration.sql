/*
  Warnings:

  - You are about to drop the column `description` on the `Procedure` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Procedure" DROP COLUMN "description",
ADD COLUMN     "actualprice" TEXT,
ADD COLUMN     "briefdescription" TEXT,
ADD COLUMN     "discountedprice" TEXT,
ADD COLUMN     "fulldescription" TEXT;
