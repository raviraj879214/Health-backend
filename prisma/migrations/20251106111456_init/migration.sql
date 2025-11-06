-- CreateTable
CREATE TABLE "Patients" (
    "id" BIGSERIAL NOT NULL,
    "patient_code" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "gender" TEXT,
    "dob" TIMESTAMP(3),
    "phone" TEXT,
    "email" TEXT,
    "password" TEXT,
    "reset_token" TEXT,
    "reset_token_exp" TIMESTAMP(3),
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Patients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Patients_patient_code_key" ON "Patients"("patient_code");

-- CreateIndex
CREATE UNIQUE INDEX "Patients_email_key" ON "Patients"("email");
