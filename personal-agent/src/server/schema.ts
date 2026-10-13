import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  displayName: text("display_name").notNull(),
  timezone: text("timezone").notNull().default("Australia/Sydney"),
  onboardingState: text("onboarding_state").notNull().default("started"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const controlState = pgTable("control_state", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id),
  paused: boolean("paused").notNull().default(false),
  pauseUntil: timestamp("pause_until", { withTimezone: true }),
  revision: integer("revision").notNull().default(1),
  quietHoursStart: text("quiet_hours_start").notNull().default("21:00"),
  quietHoursEnd: text("quiet_hours_end").notNull().default("08:00"),
  maxMessagesPerDay: integer("max_messages_per_day").notNull().default(3),
  minSpacingMinutes: integer("min_spacing_minutes").notNull().default(120),
  activityLevel: text("activity_level").notNull().default("balanced"),
  channelPrefs: jsonb("channel_prefs")
    .$type<{ inApp: boolean; webPush: boolean; sms: boolean }>()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const preferences = pgTable("preferences", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  topic: text("topic").notNull(),
  polarity: text("polarity").notNull(),
  weight: integer("weight").notNull().default(0),
  explicit: boolean("explicit").notNull().default(true),
  scope: text("scope"),
  provenance: text("provenance"),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const facts = pgTable("facts", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  entity: text("entity").notNull(),
  attribute: text("attribute").notNull(),
  value: text("value").notNull(),
  sourceRefs: jsonb("source_refs").$type<string[]>().notNull().default([]),
  confidence: integer("confidence").notNull().default(80),
  explicit: boolean("explicit").notNull().default(true),
  tombstoned: boolean("tombstoned").notNull().default(false),
  observedAt: timestamp("observed_at", { withTimezone: true }).notNull().defaultNow(),
  validUntil: timestamp("valid_until", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const conversations = pgTable("conversations", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  channel: text("channel").notNull().default("web"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const messages = pgTable("messages", {
  id: text("id").primaryKey(),
  conversationId: text("conversation_id")
    .notNull()
    .references(() => conversations.id),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  role: text("role").notNull(),
  body: text("body").notNull(),
  suggestionId: text("suggestion_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const candidates = pgTable(
  "candidates",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    topic: text("topic").notNull(),
    title: text("title").notNull(),
    opener: text("opener").notNull(),
    details: text("details").notNull(),
    reasonForUser: text("reason_for_user").notNull(),
    reasonNow: text("reason_now").notNull(),
    evidence: jsonb("evidence").notNull(),
    relevance: integer("relevance").notNull(),
    timing: integer("timing").notNull(),
    novelty: integer("novelty").notNull(),
    effort: integer("effort").notNull().default(50),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    dedupeKey: text("dedupe_key").notNull(),
    status: text("status").notNull().default("open"),
    urgent: boolean("urgent").notNull().default(false),
    fixture: boolean("fixture").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("candidates_user_dedupe").on(t.userId, t.dedupeKey)],
);

export const feedbackEvents = pgTable("feedback_events", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  idempotencyKey: text("idempotency_key").notNull().unique(),
  kind: text("kind").notNull(),
  targetSuggestionId: text("target_suggestion_id"),
  originalPhrase: text("original_phrase").notNull(),
  acknowledgement: text("acknowledgement").notNull(),
  payload: jsonb("payload"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const reminders = pgTable("reminders", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  suggestionId: text("suggestion_id"),
  localPhrase: text("local_phrase").notNull(),
  fireAt: timestamp("fire_at", { withTimezone: true }).notNull(),
  timezone: text("timezone").notNull(),
  status: text("status").notNull().default("scheduled"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const connections = pgTable("connections", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  provider: text("provider").notNull(),
  accountRef: text("account_ref"),
  scopes: jsonb("scopes").$type<string[]>().notNull().default([]),
  status: text("status").notNull().default("disconnected"),
  lastSuccessAt: timestamp("last_success_at", { withTimezone: true }),
  syncCursor: text("sync_cursor"),
  fixture: boolean("fixture").notNull().default(false),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const outbox = pgTable("outbox", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  candidateId: text("candidate_id"),
  channel: text("channel").notNull(),
  idempotencyKey: text("idempotency_key").notNull().unique(),
  policyRevision: integer("policy_revision").notNull(),
  status: text("status").notNull().default("pending"),
  payload: jsonb("payload"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const auditEvents = pgTable("audit_events", {
  id: text("id").primaryKey(),
  userId: text("user_id"),
  action: text("action").notNull(),
  actor: text("actor").notNull(),
  details: jsonb("details"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
