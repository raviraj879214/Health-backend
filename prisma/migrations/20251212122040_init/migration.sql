-- AlterTable
ALTER TABLE "PackageProcedure" ADD COLUMN     "suggestedCategoryId" UUID;

-- AddForeignKey
ALTER TABLE "PackageProcedure" ADD CONSTRAINT "PackageProcedure_suggestedCategoryId_fkey" FOREIGN KEY ("suggestedCategoryId") REFERENCES "SpecializationRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
