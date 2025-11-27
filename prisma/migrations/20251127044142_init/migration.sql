-- CreateTable
CREATE TABLE "ClinicSurgariesImages" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "clinicuuid" TEXT,
    "type" TEXT,
    "Images" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicSurgariesImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicSurgeryImage" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "clinicUuid" TEXT,
    "doctorUuid" TEXT,
    "imageType" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicSurgeryImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClinicSurgariesImages_uuid_key" ON "ClinicSurgariesImages"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicSurgeryImage_uuid_key" ON "ClinicSurgeryImage"("uuid");
