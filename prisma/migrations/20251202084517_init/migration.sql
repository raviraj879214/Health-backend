-- AlterTable
ALTER TABLE "DoctorSpecialization" ADD COLUMN     "suggestedCategoryId" UUID;

-- CreateTable
CREATE TABLE "SpecializationRequest" (
    "id" UUID NOT NULL,
    "type" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpecializationRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DoctorSpecialization" ADD CONSTRAINT "DoctorSpecialization_suggestedCategoryId_fkey" FOREIGN KEY ("suggestedCategoryId") REFERENCES "SpecializationRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
