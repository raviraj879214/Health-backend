-- CreateTable
CREATE TABLE "ClinicSpecialty" (
    "id" UUID NOT NULL,
    "clinicUuid" UUID NOT NULL,
    "specialtyId" UUID,
    "suggestedCategoryId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClinicSpecialty_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClinicSpecialty_clinicUuid_specialtyId_key" ON "ClinicSpecialty"("clinicUuid", "specialtyId");

-- AddForeignKey
ALTER TABLE "ClinicSpecialty" ADD CONSTRAINT "ClinicSpecialty_clinicUuid_fkey" FOREIGN KEY ("clinicUuid") REFERENCES "Doctor"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicSpecialty" ADD CONSTRAINT "ClinicSpecialty_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "Specialty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicSpecialty" ADD CONSTRAINT "ClinicSpecialty_suggestedCategoryId_fkey" FOREIGN KEY ("suggestedCategoryId") REFERENCES "SpecializationRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
