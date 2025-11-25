-- CreateTable
CREATE TABLE "ClinicImages" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "clinicuuid" TEXT,
    "type" TEXT,
    "Images" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicImages_pkey" PRIMARY KEY ("id")
);
