-- CreateTable
CREATE TABLE "PatientQueryPaymentDetails" (
    "id" UUID NOT NULL,
    "packageprice" TEXT,
    "finalprice" TEXT,
    "generatedlink" TEXT,
    "generatedamount" TEXT,
    "status" INTEGER NOT NULL DEFAULT 0,
    "patientQueryId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PatientQueryPaymentDetails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PatientQueryPaymentDetails" ADD CONSTRAINT "PatientQueryPaymentDetails_patientQueryId_fkey" FOREIGN KEY ("patientQueryId") REFERENCES "PatientQuery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
