-- CreateTable
CREATE TABLE "clinic_packages" (
    "id" UUID NOT NULL,
    "clinicId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clinic_packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "boost_packages" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "boost_packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinic_boosts" (
    "id" UUID NOT NULL,
    "clinicPackageId" UUID NOT NULL,
    "boostPackageId" UUID NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clinic_boosts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "clinic_boosts" ADD CONSTRAINT "clinic_boosts_clinicPackageId_fkey" FOREIGN KEY ("clinicPackageId") REFERENCES "clinic_packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinic_boosts" ADD CONSTRAINT "clinic_boosts_boostPackageId_fkey" FOREIGN KEY ("boostPackageId") REFERENCES "boost_packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
