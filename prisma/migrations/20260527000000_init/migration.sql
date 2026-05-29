-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('super_admin', 'admin', 'editor', 'viewer');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('draft', 'published', 'archived');

-- CreateEnum
CREATE TYPE "PriceDisplay" AS ENUM ('show', 'hidden', 'inquiry');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('unread', 'in_progress', 'replied', 'completed', 'rejected', 'archived');

-- CreateTable
CREATE TABLE "admin_users" (
    "id" BIGSERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" VARCHAR(100),
    "role" "AdminRole" NOT NULL DEFAULT 'editor',
    "avatar" TEXT,
    "totp_secret" TEXT,
    "totp_enabled" BOOLEAN NOT NULL DEFAULT false,
    "totp_verified_at" TIMESTAMPTZ(6),
    "totp_backup_codes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "last_login_at" TIMESTAMPTZ(6),
    "failed_login_count" INTEGER NOT NULL DEFAULT 0,
    "last_failed_login_at" TIMESTAMPTZ(6),
    "locked_until" TIMESTAMPTZ(6),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" BIGSERIAL NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "name" JSONB NOT NULL,
    "description" JSONB,
    "parent_id" BIGINT,
    "cover_media_id" BIGINT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "show_on_home" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" BIGSERIAL NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "name" JSONB NOT NULL,
    "description" JSONB,
    "era" JSONB,
    "origin" JSONB,
    "artist" VARCHAR(255),
    "dimensions" VARCHAR(255),
    "weight" VARCHAR(100),
    "condition" JSONB,
    "price" DECIMAL(12,0),
    "currency" VARCHAR(3) NOT NULL DEFAULT 'JPY',
    "price_display" "PriceDisplay" NOT NULL DEFAULT 'inquiry',
    "category_id" BIGINT,
    "status" "ContentStatus" NOT NULL DEFAULT 'draft',
    "is_new" BOOLEAN NOT NULL DEFAULT false,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "show_on_home" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "meta_title" JSONB,
    "meta_description" JSONB,
    "og_image" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_images" (
    "id" BIGSERIAL NOT NULL,
    "item_id" BIGINT NOT NULL,
    "media_id" BIGINT,
    "url" TEXT NOT NULL,
    "url_webp" TEXT,
    "url_thumb" TEXT,
    "alt_text" JSONB,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "item_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" BIGSERIAL NOT NULL,
    "name" JSONB NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_tag_relations" (
    "item_id" BIGINT NOT NULL,
    "tag_id" BIGINT NOT NULL,

    CONSTRAINT "item_tag_relations_pkey" PRIMARY KEY ("item_id","tag_id")
);

-- CreateTable
CREATE TABLE "blog_posts" (
    "id" BIGSERIAL NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "title" JSONB NOT NULL,
    "excerpt" JSONB,
    "content" JSONB,
    "cover_media_id" BIGINT,
    "author_id" BIGINT,
    "category" VARCHAR(100),
    "tags" TEXT[],
    "status" "ContentStatus" NOT NULL DEFAULT 'draft',
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMPTZ(6),
    "meta_title" JSONB,
    "meta_description" JSONB,
    "og_image" TEXT,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news" (
    "id" BIGSERIAL NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "title" JSONB NOT NULL,
    "content" JSONB,
    "type" VARCHAR(50),
    "tags" TEXT[],
    "status" "ContentStatus" NOT NULL DEFAULT 'draft',
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMPTZ(6),
    "meta_title" JSONB,
    "meta_description" JSONB,
    "og_image" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appraisal_requests" (
    "id" BIGSERIAL NOT NULL,
    "request_no" VARCHAR(32) NOT NULL,
    "type" VARCHAR(30) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(40),
    "region" VARCHAR(100),
    "item_category" VARCHAR(100),
    "description" TEXT,
    "preferred_date" DATE,
    "images" TEXT[],
    "status" "RequestStatus" NOT NULL DEFAULT 'unread',
    "admin_note" TEXT,
    "lang" VARCHAR(5) NOT NULL DEFAULT 'ja',
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "appraisal_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_messages" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(40),
    "category" VARCHAR(50),
    "message" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'unread',
    "lang" VARCHAR(5) NOT NULL DEFAULT 'ja',
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_blocks" (
    "id" BIGSERIAL NOT NULL,
    "page_key" VARCHAR(100) NOT NULL,
    "block_key" VARCHAR(100) NOT NULL,
    "content" JSONB NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "page_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" BIGSERIAL NOT NULL,
    "filename" VARCHAR(255) NOT NULL,
    "original_name" VARCHAR(255),
    "url" TEXT NOT NULL,
    "url_webp" TEXT,
    "url_thumb" TEXT,
    "mime_type" VARCHAR(100),
    "file_size" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "alt_text" JSONB,
    "uploaded_by" BIGINT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_settings" (
    "key" VARCHAR(100) NOT NULL,
    "value" JSONB NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" BIGSERIAL NOT NULL,
    "admin_user_id" BIGINT,
    "action" VARCHAR(100) NOT NULL,
    "target_type" VARCHAR(100),
    "target_id" VARCHAR(100),
    "before_data" JSONB,
    "after_data" JSONB,
    "ip_address" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "items_slug_key" ON "items"("slug");

-- CreateIndex
CREATE INDEX "items_status_category_id_idx" ON "items"("status", "category_id");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "tags"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "blog_posts_slug_key" ON "blog_posts"("slug");

-- CreateIndex
CREATE INDEX "blog_posts_status_published_at_idx" ON "blog_posts"("status", "published_at");

-- CreateIndex
CREATE UNIQUE INDEX "news_slug_key" ON "news"("slug");

-- CreateIndex
CREATE INDEX "news_status_published_at_idx" ON "news"("status", "published_at");

-- CreateIndex
CREATE UNIQUE INDEX "appraisal_requests_request_no_key" ON "appraisal_requests"("request_no");

-- CreateIndex
CREATE UNIQUE INDEX "page_blocks_page_key_block_key_key" ON "page_blocks"("page_key", "block_key");

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_cover_media_id_fkey" FOREIGN KEY ("cover_media_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_images" ADD CONSTRAINT "item_images_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_images" ADD CONSTRAINT "item_images_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_tag_relations" ADD CONSTRAINT "item_tag_relations_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_tag_relations" ADD CONSTRAINT "item_tag_relations_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_cover_media_id_fkey" FOREIGN KEY ("cover_media_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_admin_user_id_fkey" FOREIGN KEY ("admin_user_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
