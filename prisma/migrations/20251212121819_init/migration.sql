-- CreateTable
CREATE TABLE "PackageProcedure" (
    "id" TEXT NOT NULL,
    "procedureid" TEXT,

    CONSTRAINT "PackageProcedure_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PackageProcedure" ADD CONSTRAINT "PackageProcedure_procedureid_fkey" FOREIGN KEY ("procedureid") REFERENCES "Procedure"("id") ON DELETE SET NULL ON UPDATE CASCADE;
