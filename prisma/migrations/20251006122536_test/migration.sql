-- DropForeignKey
ALTER TABLE "public"."Blog" DROP CONSTRAINT "Blog_tagId_fkey";

-- AlterTable
ALTER TABLE "public"."Blog" ALTER COLUMN "tagId" SET DATA TYPE TEXT;
