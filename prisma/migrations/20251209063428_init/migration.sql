-- CreateTable
CREATE TABLE "ClinicSpecialization" (
    "id" UUID NOT NULL,
    "clinicUuid" UUID NOT NULL,
    "specializationId" UUID,
    "suggestedCategoryId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClinicSpecialization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClinicSpecialization_clinicUuid_specializationId_key" ON "ClinicSpecialization"("clinicUuid", "specializationId");

-- AddForeignKey
ALTER TABLE "ClinicSpecialization" ADD CONSTRAINT "ClinicSpecialization_suggestedCategoryId_fkey" FOREIGN KEY ("suggestedCategoryId") REFERENCES "SpecializationRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicSpecialization" ADD CONSTRAINT "ClinicSpecialization_clinicUuid_fkey" FOREIGN KEY ("clinicUuid") REFERENCES "Clinic"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicSpecialization" ADD CONSTRAINT "ClinicSpecialization_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "Specialization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
