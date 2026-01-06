-- AlterTable
ALTER TABLE "PatientQuery" ADD COLUMN     "doctorid" UUID;

-- AddForeignKey
ALTER TABLE "PatientQuery" ADD CONSTRAINT "PatientQuery_doctorid_fkey" FOREIGN KEY ("doctorid") REFERENCES "Doctor"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;
