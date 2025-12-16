-- DropForeignKey
ALTER TABLE "public"."ClinicSpecialty" DROP CONSTRAINT "ClinicSpecialty_clinicUuid_fkey";

-- DropForeignKey
ALTER TABLE "public"."ClinicTreatment" DROP CONSTRAINT "ClinicTreatment_clinicUuid_fkey";

-- AddForeignKey
ALTER TABLE "ClinicSpecialty" ADD CONSTRAINT "ClinicSpecialty_clinicUuid_fkey" FOREIGN KEY ("clinicUuid") REFERENCES "Clinic"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicTreatment" ADD CONSTRAINT "ClinicTreatment_clinicUuid_fkey" FOREIGN KEY ("clinicUuid") REFERENCES "Clinic"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
