-- CreateTable
CREATE TABLE "PackageDoctor" (
    "id" UUID NOT NULL,
    "packageId" UUID NOT NULL,
    "doctorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PackageDoctor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PackageDoctor" ADD CONSTRAINT "PackageDoctor_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "ClinicPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
