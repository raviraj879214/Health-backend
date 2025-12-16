-- CreateTable
CREATE TABLE "PackageTreatment" (
    "id" UUID NOT NULL,
    "packageId" UUID NOT NULL,
    "treatmentid" UUID,
    "suggestedCategoryId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PackageTreatment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PackageTreatment" ADD CONSTRAINT "PackageTreatment_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "ClinicPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageTreatment" ADD CONSTRAINT "PackageTreatment_treatmentid_fkey" FOREIGN KEY ("treatmentid") REFERENCES "Treatment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageTreatment" ADD CONSTRAINT "PackageTreatment_suggestedCategoryId_fkey" FOREIGN KEY ("suggestedCategoryId") REFERENCES "SpecializationRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
