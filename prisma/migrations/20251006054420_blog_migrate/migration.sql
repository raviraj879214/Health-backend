/*
  Warnings:

  - You are about to drop the column `liked_ips` on the `Blog` table. All the data in the column will be lost.
  - You are about to drop the column `likes_count` on the `Blog` table. All the data in the column will be lost.
  - You are about to drop the column `tagIds` on the `Blog` table. All the data in the column will be lost.
  - You are about to drop the column `viewed_ips` on the `Blog` table. All the data in the column will be lost.
  - You are about to drop the column `views_count` on the `Blog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Blog" DROP COLUMN "liked_ips",
DROP COLUMN "likes_count",
DROP COLUMN "tagIds",
DROP COLUMN "viewed_ips",
DROP COLUMN "views_count",
ADD COLUMN     "tagId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Blog" ADD CONSTRAINT "Blog_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "public"."Tag"("id") ON DELETE SET NULL ON UPDATE CASCADE;
