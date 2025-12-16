-- CreateTable
CREATE TABLE "ClinicDoctorAddress" (
    "id" UUID NOT NULL,
    "clinicUuid" UUID NOT NULL,
    "doctorUuid" UUID NOT NULL,
    "zipcode" TEXT,
    "street" TEXT,
    "complement" TEXT,
    "postalUnit" TEXT,
    "neighborhood" TEXT,
    "city" TEXT,
    "stateCode" TEXT,
    "stateName" TEXT,
    "region" TEXT,
    "ibgeCode" TEXT,
    "giaCode" TEXT,
    "areaCode" TEXT,
    "siafiCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicDoctorAddress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClinicDoctorAddress_clinicUuid_doctorUuid_key" ON "ClinicDoctorAddress"("clinicUuid", "doctorUuid");

-- AddForeignKey
ALTER TABLE "ClinicDoctorAddress" ADD CONSTRAINT "ClinicDoctorAddress_clinicUuid_fkey" FOREIGN KEY ("clinicUuid") REFERENCES "Clinic"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicDoctorAddress" ADD CONSTRAINT "ClinicDoctorAddress_doctorUuid_fkey" FOREIGN KEY ("doctorUuid") REFERENCES "Doctor"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
