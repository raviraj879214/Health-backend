-- CreateTable
CREATE TABLE "PackageFieldDefinition" (
    "id" UUID NOT NULL,
    "fieldKey" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "fieldType" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PackageFieldDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageFieldValue" (
    "id" UUID NOT NULL,
    "packageId" UUID NOT NULL,
    "fieldId" UUID NOT NULL,
    "valueText" TEXT,
    "valueNumber" INTEGER,
    "valueBoolean" BOOLEAN,
    "valueDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PackageFieldValue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PackageFieldDefinition_fieldKey_key" ON "PackageFieldDefinition"("fieldKey");

-- CreateIndex
CREATE UNIQUE INDEX "PackageFieldValue_packageId_fieldId_key" ON "PackageFieldValue"("packageId", "fieldId");

-- AddForeignKey
ALTER TABLE "PackageFieldValue" ADD CONSTRAINT "PackageFieldValue_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "ClinicPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageFieldValue" ADD CONSTRAINT "PackageFieldValue_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "PackageFieldDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
