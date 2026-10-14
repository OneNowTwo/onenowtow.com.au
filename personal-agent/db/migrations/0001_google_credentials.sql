ALTER TABLE "connections" ADD COLUMN IF NOT EXISTS "credential_blob" text;
ALTER TABLE "connections" ADD COLUMN IF NOT EXISTS "error_message" text;

CREATE TABLE IF NOT EXISTS "source_records" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL REFERENCES "users"("id"),
  "connection_id" text NOT NULL REFERENCES "connections"("id"),
  "provider" text NOT NULL,
  "external_id" text NOT NULL,
  "record_type" text NOT NULL,
  "content" jsonb NOT NULL,
  "source_timestamp" timestamptz,
  "fetched_at" timestamptz DEFAULT now() NOT NULL,
  "deleted" boolean DEFAULT false NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "source_records_user_provider_ext"
  ON "source_records" ("user_id", "provider", "external_id");
