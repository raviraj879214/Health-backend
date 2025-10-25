-- CreateTable
CREATE TABLE "Specialty" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "typeId" INTEGER NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "description" VARCHAR(500),
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Specialty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecialtyType" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpecialtyType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Specialty" ADD CONSTRAINT "Specialty_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "SpecialtyType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
