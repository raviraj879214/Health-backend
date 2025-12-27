/*
  Warnings:

  - You are about to drop the column `qquerycode` on the `PatientQuery` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PatientQuery" DROP COLUMN "qquerycode",
ADD COLUMN     "querycode" TEXT;
