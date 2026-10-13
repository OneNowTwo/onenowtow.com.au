CREATE TABLE IF NOT EXISTS "users" (
  "id" text PRIMARY KEY NOT NULL,
  "email" text NOT NULL UNIQUE,
  "display_name" text NOT NULL,
  "timezone" text DEFAULT 'Australia/Sydney' NOT NULL,
  "onboarding_state" text DEFAULT 'started' NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "control_state" (
  "user_id" text PRIMARY KEY NOT NULL REFERENCES "users"("id"),
  "paused" boolean DEFAULT false NOT NULL,
  "pause_until" timestamptz,
  "revision" integer DEFAULT 1 NOT NULL,
  "quiet_hours_start" text DEFAULT '21:00' NOT NULL,
  "quiet_hours_end" text DEFAULT '08:00' NOT NULL,
  "max_messages_per_day" integer DEFAULT 3 NOT NULL,
  "min_spacing_minutes" integer DEFAULT 120 NOT NULL,
  "activity_level" text DEFAULT 'balanced' NOT NULL,
  "channel_prefs" jsonb NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "preferences" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL REFERENCES "users"("id"),
  "topic" text NOT NULL,
  "polarity" text NOT NULL,
  "weight" integer DEFAULT 0 NOT NULL,
  "explicit" boolean DEFAULT true NOT NULL,
  "scope" text,
  "provenance" text,
  "expires_at" timestamptz,
  "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "facts" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL REFERENCES "users"("id"),
  "entity" text NOT NULL,
  "attribute" text NOT NULL,
  "value" text NOT NULL,
  "source_refs" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "confidence" integer DEFAULT 80 NOT NULL,
  "explicit" boolean DEFAULT true NOT NULL,
  "tombstoned" boolean DEFAULT false NOT NULL,
  "observed_at" timestamptz DEFAULT now() NOT NULL,
  "valid_until" timestamptz,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "conversations" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL REFERENCES "users"("id"),
  "channel" text DEFAULT 'web' NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "messages" (
  "id" text PRIMARY KEY NOT NULL,
  "conversation_id" text NOT NULL REFERENCES "conversations"("id"),
  "user_id" text NOT NULL REFERENCES "users"("id"),
  "role" text NOT NULL,
  "body" text NOT NULL,
  "suggestion_id" text,
  "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "candidates" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL REFERENCES "users"("id"),
  "topic" text NOT NULL,
  "title" text NOT NULL,
  "opener" text NOT NULL,
  "details" text NOT NULL,
  "reason_for_user" text NOT NULL,
  "reason_now" text NOT NULL,
  "evidence" jsonb NOT NULL,
  "relevance" integer NOT NULL,
  "timing" integer NOT NULL,
  "novelty" integer NOT NULL,
  "effort" integer DEFAULT 50 NOT NULL,
  "expires_at" timestamptz,
  "dedupe_key" text NOT NULL,
  "status" text DEFAULT 'open' NOT NULL,
  "urgent" boolean DEFAULT false NOT NULL,
  "fixture" boolean DEFAULT false NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "candidates_user_dedupe" ON "candidates" ("user_id","dedupe_key");

CREATE TABLE IF NOT EXISTS "feedback_events" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL REFERENCES "users"("id"),
  "idempotency_key" text NOT NULL UNIQUE,
  "kind" text NOT NULL,
  "target_suggestion_id" text,
  "original_phrase" text NOT NULL,
  "acknowledgement" text NOT NULL,
  "payload" jsonb,
  "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "reminders" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL REFERENCES "users"("id"),
  "suggestion_id" text,
  "local_phrase" text NOT NULL,
  "fire_at" timestamptz NOT NULL,
  "timezone" text NOT NULL,
  "status" text DEFAULT 'scheduled' NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "connections" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL REFERENCES "users"("id"),
  "provider" text NOT NULL,
  "account_ref" text,
  "scopes" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "status" text DEFAULT 'disconnected' NOT NULL,
  "last_success_at" timestamptz,
  "sync_cursor" text,
  "fixture" boolean DEFAULT false NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "outbox" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL REFERENCES "users"("id"),
  "candidate_id" text,
  "channel" text NOT NULL,
  "idempotency_key" text NOT NULL UNIQUE,
  "policy_revision" integer NOT NULL,
  "status" text DEFAULT 'pending' NOT NULL,
  "payload" jsonb,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "audit_events" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text,
  "action" text NOT NULL,
  "actor" text NOT NULL,
  "details" jsonb,
  "created_at" timestamptz DEFAULT now() NOT NULL
);
