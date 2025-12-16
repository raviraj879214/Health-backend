-- CreateTable
CREATE TABLE "DoctorSpecialization" (
    "id" UUID NOT NULL,
    "doctorUuid" UUID NOT NULL,
    "specializationId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DoctorSpecialization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DoctorSpecialization_doctorUuid_specializationId_key" ON "DoctorSpecialization"("doctorUuid", "specializationId");

-- AddForeignKey
ALTER TABLE "DoctorSpecialization" ADD CONSTRAINT "DoctorSpecialization_doctorUuid_fkey" FOREIGN KEY ("doctorUuid") REFERENCES "Doctor"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorSpecialization" ADD CONSTRAINT "DoctorSpecialization_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "Specialization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
