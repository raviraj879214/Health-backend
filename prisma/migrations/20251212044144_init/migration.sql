/*
  Warnings:

  - The primary key for the `Procedure` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Procedure" DROP CONSTRAINT "Procedure_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Procedure_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Procedure_id_seq";
