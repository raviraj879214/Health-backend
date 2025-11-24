/*
  Warnings:

  - You are about to drop the column `lastanme` on the `ClinicUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ClinicUser" DROP COLUMN "lastanme",
ADD COLUMN     "lastname" TEXT;
