-- CreateTable
CREATE TABLE "ClinicDoctor" (
    "id" SERIAL NOT NULL,
    "clinicUuid" UUID NOT NULL,
    "doctorUuid" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicDoctor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClinicDoctor_clinicUuid_doctorUuid_key" ON "ClinicDoctor"("clinicUuid", "doctorUuid");

-- AddForeignKey
ALTER TABLE "ClinicDoctor" ADD CONSTRAINT "ClinicDoctor_clinicUuid_fkey" FOREIGN KEY ("clinicUuid") REFERENCES "Clinic"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicDoctor" ADD CONSTRAINT "ClinicDoctor_doctorUuid_fkey" FOREIGN KEY ("doctorUuid") REFERENCES "Doctor"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
