-- CreateTable
CREATE TABLE "clinic_google_accounts" (
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

    CONSTRAINT "clinic_google_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "google_reviews" (
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

    CONSTRAINT "google_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinic_rating_summary" (
    "clinicUuid" UUID NOT NULL,
    "averageRating" DECIMAL(2,1) NOT NULL,
    "totalReviews" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clinic_rating_summary_pkey" PRIMARY KEY ("clinicUuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "clinic_google_accounts_clinicUuid_key" ON "clinic_google_accounts"("clinicUuid");

-- CreateIndex
CREATE UNIQUE INDEX "google_reviews_googleReviewId_key" ON "google_reviews"("googleReviewId");

-- CreateIndex
CREATE INDEX "google_reviews_clinicUuid_idx" ON "google_reviews"("clinicUuid");

-- AddForeignKey
ALTER TABLE "clinic_google_accounts" ADD CONSTRAINT "clinic_google_accounts_clinicUuid_fkey" FOREIGN KEY ("clinicUuid") REFERENCES "Clinic"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "google_reviews" ADD CONSTRAINT "google_reviews_clinicUuid_fkey" FOREIGN KEY ("clinicUuid") REFERENCES "Clinic"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinic_rating_summary" ADD CONSTRAINT "clinic_rating_summary_clinicUuid_fkey" FOREIGN KEY ("clinicUuid") REFERENCES "Clinic"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
