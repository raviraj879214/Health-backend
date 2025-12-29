-- CreateTable
CREATE TABLE "ClinicListingBoost" (
    "id" UUID NOT NULL,
    "clinicId" UUID NOT NULL,
    "boostPackageId" UUID NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clinicuserid" TEXT,

    CONSTRAINT "ClinicListingBoost_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClinicListingBoost" ADD CONSTRAINT "ClinicListingBoost_boostPackageId_fkey" FOREIGN KEY ("boostPackageId") REFERENCES "BoostPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicListingBoost" ADD CONSTRAINT "ClinicListingBoost_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
