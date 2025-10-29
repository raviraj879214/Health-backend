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

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_slug_idx" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_parent_category_id_idx" ON "Category"("parent_category_id");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parent_category_id_fkey" FOREIGN KEY ("parent_category_id") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
