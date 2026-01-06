-- DropForeignKey
ALTER TABLE "public"."PatientQuery" DROP CONSTRAINT "PatientQuery_clinicId_fkey";

-- AlterTable
ALTER TABLE "PatientQuery" ADD COLUMN     "medicalReportsValue" TEXT,
ADD COLUMN     "procedureTimeValue" TEXT,
ADD COLUMN     "treatmentName" TEXT,
ADD COLUMN     "whatMatterMostName" TEXT,
ALTER COLUMN "clinicId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "PatientQuery" ADD CONSTRAINT "PatientQuery_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;
