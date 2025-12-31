/*
  Warnings:

  - You are about to drop the `clinic_google_accounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `clinic_rating_summary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `google_reviews` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."clinic_google_accounts" DROP CONSTRAINT "clinic_google_accounts_clinicUuid_fkey";

-- DropForeignKey
ALTER TABLE "public"."clinic_rating_summary" DROP CONSTRAINT "clinic_rating_summary_clinicUuid_fkey";

-- DropForeignKey
ALTER TABLE "public"."google_reviews" DROP CONSTRAINT "google_reviews_clinicUuid_fkey";

-- DropTable
DROP TABLE "public"."clinic_google_accounts";

-- DropTable
DROP TABLE "public"."clinic_rating_summary";

-- DropTable
DROP TABLE "public"."google_reviews";

-- CreateTable
CREATE TABLE "ClinicGoogleAccount" (
    "id" SERIAL NOT NULL,
    "clinicUuid" UUID NOT NULL,
    "googleAccountId" TEXT NOT NULL,
    "googleLocationId" TEXT NOT NULL,
    "googlePlaceId" TEXT,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "tokenExpiry" TIMESTAMP(3),
    "lastSyncedAt" TIMESTAMP(3),
    "isConnected" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicGoogleAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoogleReview" (
    "id" SERIAL NOT NULL,
    "clinicUuid" UUID NOT NULL,
    "googleReviewId" TEXT NOT NULL,
    "authorName" TEXT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "reviewTime" TIMESTAMP(3) NOT NULL,
    "replyText" TEXT,
    "replyTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GoogleReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicRatingSummary" (
    "clinicUuid" UUID NOT NULL,
    "averageRating" DECIMAL(2,1) NOT NULL,
    "totalReviews" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicRatingSummary_pkey" PRIMARY KEY ("clinicUuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClinicGoogleAccount_clinicUuid_key" ON "ClinicGoogleAccount"("clinicUuid");

-- CreateIndex
CREATE UNIQUE INDEX "GoogleReview_googleReviewId_key" ON "GoogleReview"("googleReviewId");

-- CreateIndex
CREATE INDEX "GoogleReview_clinicUuid_idx" ON "GoogleReview"("clinicUuid");

-- AddForeignKey
ALTER TABLE "ClinicGoogleAccount" ADD CONSTRAINT "ClinicGoogleAccount_clinicUuid_fkey" FOREIGN KEY ("clinicUuid") REFERENCES "Clinic"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoogleReview" ADD CONSTRAINT "GoogleReview_clinicUuid_fkey" FOREIGN KEY ("clinicUuid") REFERENCES "Clinic"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicRatingSummary" ADD CONSTRAINT "ClinicRatingSummary_clinicUuid_fkey" FOREIGN KEY ("clinicUuid") REFERENCES "Clinic"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
