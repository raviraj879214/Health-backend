-- CreateTable
CREATE TABLE "ClinicTreatment" (
    "id" UUID NOT NULL,
    "clinicUuid" UUID NOT NULL,
    "treatmentid" UUID,
    "suggestedCategoryId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClinicTreatment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClinicTreatment_clinicUuid_treatmentid_key" ON "ClinicTreatment"("clinicUuid", "treatmentid");

-- AddForeignKey
ALTER TABLE "ClinicTreatment" ADD CONSTRAINT "ClinicTreatment_clinicUuid_fkey" FOREIGN KEY ("clinicUuid") REFERENCES "Doctor"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicTreatment" ADD CONSTRAINT "ClinicTreatment_treatmentid_fkey" FOREIGN KEY ("treatmentid") REFERENCES "Treatment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicTreatment" ADD CONSTRAINT "ClinicTreatment_suggestedCategoryId_fkey" FOREIGN KEY ("suggestedCategoryId") REFERENCES "SpecializationRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
