-- AlterTable
ALTER TABLE "Clinic" ADD COLUMN     "cep" TEXT,
ADD COLUMN     "citycep" TEXT,
ADD COLUMN     "cnpj" TEXT,
ADD COLUMN     "complement" TEXT,
ADD COLUMN     "latitude" DECIMAL,
ADD COLUMN     "longitude" DECIMAL,
ADD COLUMN     "neighborhood" TEXT,
ADD COLUMN     "street" TEXT;

-- AlterTable
ALTER TABLE "PatientQuery" ADD COLUMN     "cordinatorid" INTEGER;

-- AddForeignKey
ALTER TABLE "PatientQuery" ADD CONSTRAINT "PatientQuery_cordinatorid_fkey" FOREIGN KEY ("cordinatorid") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
