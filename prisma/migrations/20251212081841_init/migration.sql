-- CreateTable
CREATE TABLE "PackageSpecialization" (
    "id" UUID NOT NULL,
    "packageId" UUID NOT NULL,
    "specializationId" UUID,
    "suggestedCategoryId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PackageSpecialization_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PackageSpecialization" ADD CONSTRAINT "PackageSpecialization_suggestedCategoryId_fkey" FOREIGN KEY ("suggestedCategoryId") REFERENCES "SpecializationRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageSpecialization" ADD CONSTRAINT "PackageSpecialization_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "ClinicPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageSpecialization" ADD CONSTRAINT "PackageSpecialization_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "Specialization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
