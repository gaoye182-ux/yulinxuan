ALTER TABLE "contact_messages"
  ADD COLUMN IF NOT EXISTS "admin_note" TEXT,
  ADD COLUMN IF NOT EXISTS "reply_note" TEXT;

ALTER TABLE "items"
  ADD COLUMN IF NOT EXISTS "published_at" TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS "items_status_published_at_idx" ON "items"("status", "published_at");
