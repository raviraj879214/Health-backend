-- AlterTable
ALTER TABLE "Clinic" ADD COLUMN     "cordinatorid" INTEGER;

-- AddForeignKey
ALTER TABLE "Clinic" ADD CONSTRAINT "Clinic_cordinatorid_fkey" FOREIGN KEY ("cordinatorid") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
