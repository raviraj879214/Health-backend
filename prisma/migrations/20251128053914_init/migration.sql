-- CreateTable
CREATE TABLE "ClinicAccreditation" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "Images" TEXT,
    "text" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicAccreditation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClinicAccreditation_uuid_key" ON "ClinicAccreditation"("uuid");
