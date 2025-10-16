/*
  Warnings:

  - You are about to drop the column `blogId` on the `Tag` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Tag" DROP CONSTRAINT "Tag_blogId_fkey";

-- DropIndex
DROP INDEX "public"."Tag_name_blogId_key";

-- AlterTable
ALTER TABLE "public"."Blog" ADD COLUMN     "tagIds" INTEGER[] DEFAULT ARRAY[]::INTEGER[];

-- AlterTable
ALTER TABLE "public"."Tag" DROP COLUMN "blogId";

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "public"."Tag"("name");
