-- CreateTable
CREATE TABLE "Treatment" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Treatment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorTreatment" (
    "id" UUID NOT NULL,
    "doctorUuid" UUID NOT NULL,
    "treatmentid" UUID,
    "suggestedCategoryId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DoctorTreatment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Treatment_name_key" ON "Treatment"("name");

-- AddForeignKey
ALTER TABLE "DoctorTreatment" ADD CONSTRAINT "DoctorTreatment_doctorUuid_fkey" FOREIGN KEY ("doctorUuid") REFERENCES "Doctor"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorTreatment" ADD CONSTRAINT "DoctorTreatment_treatmentid_fkey" FOREIGN KEY ("treatmentid") REFERENCES "Treatment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorTreatment" ADD CONSTRAINT "DoctorTreatment_suggestedCategoryId_fkey" FOREIGN KEY ("suggestedCategoryId") REFERENCES "SpecializationRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
