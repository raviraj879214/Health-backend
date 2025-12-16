/*
  Warnings:

  - You are about to drop the column `videoUrl` on the `Doctor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "videoUrl",
ADD COLUMN     "videurl" TEXT;

-- CreateTable
CREATE TABLE "Specialization" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Specialization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Specialization_name_key" ON "Specialization"("name");
