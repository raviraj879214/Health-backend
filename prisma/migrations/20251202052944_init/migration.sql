-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Module" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleModule" (
    "id" SERIAL NOT NULL,
    "roleId" INTEGER NOT NULL,
    "moduleId" INTEGER NOT NULL,
    "canCreate" BOOLEAN NOT NULL DEFAULT false,
    "canDelete" BOOLEAN NOT NULL DEFAULT false,
    "canRead" BOOLEAN NOT NULL DEFAULT false,
    "canUpdate" BOOLEAN NOT NULL DEFAULT false,
    "status" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "RoleModule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL,
    "Bio" TEXT,
    "firstname" TEXT,
    "lastname" TEXT,
    "address" TEXT,
    "country" TEXT,
    "phone" TEXT,
    "postalcode" TEXT,
    "state" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "action" TEXT NOT NULL,
    "description" TEXT,
    "entityType" TEXT,
    "entityId" INTEGER,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailTemplate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blog" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tagId" TEXT,
    "tagurl" TEXT,
    "titleurl" TEXT,

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeoPages" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "meta_title" TEXT,
    "meta_desc" TEXT,
    "meta_keywords" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "seopage" TEXT,

    CONSTRAINT "SeoPages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "message" VARCHAR(500) NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "type" VARCHAR(50),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "globaluserid" TEXT,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "stripeCustomerId" TEXT NOT NULL,
    "stripeSubscriptionId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Specialty" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "typeId" INTEGER NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "description" VARCHAR(500),
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Specialty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecialtyType" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpecialtyType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "slug" VARCHAR(150) NOT NULL,
    "parent_category_id" INTEGER,
    "level" INTEGER NOT NULL DEFAULT 1,
    "description" TEXT,
    "icon" VARCHAR(100),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "full_path" VARCHAR(500),
    "path_ids" VARCHAR(255),
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patients" (
    "id" SERIAL NOT NULL,
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
    "status" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "blockreason" TEXT,

    CONSTRAINT "Patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicUser" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "passwordHash" TEXT NOT NULL,
    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP(3),
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "refreshToken" TEXT,
    "firstname" TEXT,
    "lastname" TEXT,

    CONSTRAINT "ClinicUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clinic" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "imageUrl" TEXT,
    "priorityLevel" INTEGER NOT NULL DEFAULT 0,
    "promotionEnd" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clinic_code" TEXT,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "clinicUserId" INTEGER,
    "clinicUserUuid" TEXT,

    CONSTRAINT "Clinic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicImages" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "clinicuuid" TEXT,
    "type" TEXT,
    "Images" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sort" TEXT,

    CONSTRAINT "ClinicImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicSurgeryImage" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "clinicUuid" TEXT,
    "doctorUuid" TEXT,
    "imageType" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" TEXT,
    "surgeryId" TEXT,

    CONSTRAINT "ClinicSurgeryImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingPackage" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "priorityLevel" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "listinfpackage_code" TEXT,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),

    CONSTRAINT "ListingPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicListingOrder" (
    "id" SERIAL NOT NULL,
    "clinicId" INTEGER NOT NULL,
    "packageId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "stripePaymentId" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cliniclistingorder" TEXT,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),

    CONSTRAINT "ClinicListingOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Accreditation" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "image" TEXT,
    "name" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Accreditation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicAccreditation" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accreditationId" INTEGER NOT NULL,
    "clinicuuid" TEXT,

    CONSTRAINT "ClinicAccreditation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicDescription" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "briefDescription" TEXT,
    "fullDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clinicuuid" TEXT,

    CONSTRAINT "ClinicDescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Doctor" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "clinicuuid" TEXT,
    "firstname" TEXT,
    "lastname" TEXT,
    "email" TEXT,
    "dob" TEXT,
    "crm" TEXT,
    "languages" JSONB,
    "videoUrl" TEXT,
    "image" TEXT,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Module_name_key" ON "Module"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RoleModule_roleId_moduleId_key" ON "RoleModule"("roleId", "moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EmailTemplate_name_key" ON "EmailTemplate"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SeoPages_slug_key" ON "SeoPages"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_uuid_key" ON "Notification"("uuid");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Specialty_uuid_key" ON "Specialty"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "SpecialtyType_uuid_key" ON "SpecialtyType"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_slug_idx" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_parent_category_id_idx" ON "Category"("parent_category_id");

-- CreateIndex
CREATE UNIQUE INDEX "Patients_patient_code_key" ON "Patients"("patient_code");

-- CreateIndex
CREATE UNIQUE INDEX "Patients_email_key" ON "Patients"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Patients_uuid_key" ON "Patients"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicUser_uuid_key" ON "ClinicUser"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicUser_email_key" ON "ClinicUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicUser_resetToken_key" ON "ClinicUser"("resetToken");

-- CreateIndex
CREATE UNIQUE INDEX "Clinic_clinic_code_key" ON "Clinic"("clinic_code");

-- CreateIndex
CREATE UNIQUE INDEX "Clinic_uuid_key" ON "Clinic"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicImages_uuid_key" ON "ClinicImages"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicSurgeryImage_uuid_key" ON "ClinicSurgeryImage"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "ListingPackage_listinfpackage_code_key" ON "ListingPackage"("listinfpackage_code");

-- CreateIndex
CREATE UNIQUE INDEX "ListingPackage_uuid_key" ON "ListingPackage"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicListingOrder_stripePaymentId_key" ON "ClinicListingOrder"("stripePaymentId");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicListingOrder_cliniclistingorder_key" ON "ClinicListingOrder"("cliniclistingorder");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicListingOrder_uuid_key" ON "ClinicListingOrder"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Accreditation_uuid_key" ON "Accreditation"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicAccreditation_uuid_key" ON "ClinicAccreditation"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicAccreditation_clinicuuid_accreditationId_key" ON "ClinicAccreditation"("clinicuuid", "accreditationId");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicDescription_uuid_key" ON "ClinicDescription"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_uuid_key" ON "Doctor"("uuid");

-- AddForeignKey
ALTER TABLE "RoleModule" ADD CONSTRAINT "RoleModule_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleModule" ADD CONSTRAINT "RoleModule_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Specialty" ADD CONSTRAINT "Specialty_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "SpecialtyType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parent_category_id_fkey" FOREIGN KEY ("parent_category_id") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clinic" ADD CONSTRAINT "Clinic_clinicUserId_fkey" FOREIGN KEY ("clinicUserId") REFERENCES "ClinicUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicListingOrder" ADD CONSTRAINT "ClinicListingOrder_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicListingOrder" ADD CONSTRAINT "ClinicListingOrder_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "ListingPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicAccreditation" ADD CONSTRAINT "ClinicAccreditation_accreditationId_fkey" FOREIGN KEY ("accreditationId") REFERENCES "Accreditation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
