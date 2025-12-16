-- CreateTable
CREATE TABLE "PackageSpecialty" (
    "id" UUID NOT NULL,
    "packageid" UUID NOT NULL,
    "specialtyId" UUID,
    "suggestedCategoryId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PackageSpecialty_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PackageSpecialty" ADD CONSTRAINT "PackageSpecialty_packageid_fkey" FOREIGN KEY ("packageid") REFERENCES "ClinicPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageSpecialty" ADD CONSTRAINT "PackageSpecialty_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "Specialty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageSpecialty" ADD CONSTRAINT "PackageSpecialty_suggestedCategoryId_fkey" FOREIGN KEY ("suggestedCategoryId") REFERENCES "SpecializationRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
