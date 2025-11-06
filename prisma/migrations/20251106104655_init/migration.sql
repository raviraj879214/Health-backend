-- DropForeignKey
ALTER TABLE "public"."Specialty" DROP CONSTRAINT "Specialty_typeId_fkey";

-- AddForeignKey
ALTER TABLE "Specialty" ADD CONSTRAINT "Specialty_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "SpecialtyType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
