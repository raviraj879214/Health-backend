-- DropForeignKey
ALTER TABLE "public"."DoctorSpecialization" DROP CONSTRAINT "DoctorSpecialization_specializationId_fkey";

-- AlterTable
ALTER TABLE "DoctorSpecialization" ALTER COLUMN "specializationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "DoctorSpecialization" ADD CONSTRAINT "DoctorSpecialization_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "Specialization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
