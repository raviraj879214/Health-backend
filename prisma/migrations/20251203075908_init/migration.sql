/*
  Warnings:

  - Added the required column `updatedAt` to the `Doctor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "briefDescription" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fullDescription" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
