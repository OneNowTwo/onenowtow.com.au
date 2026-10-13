import { and, desc, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { parseFeedback } from "../domain/feedback";
import { DEFAULT_CONTROLS, isPaused } from "../domain/policy";
import type { DeliveryControls, PreferenceAdjustment } from "../domain/types";
import { getDb, schema } from "./db";

const {
  users,
  controlState,
  preferences,
  facts,
  feedbackEvents,
  reminders,
  connections,
  candidates,
  auditEvents,
} = schema;

export const PILOT_USER_ID = "user_michael";

export async function ensurePilotUser() {
  const db = await getDb();
  const email = process.env.PILOT_EMAIL ?? "michael@onenowtwo.com.au";
  const existing = await db.select().from(users).where(eq(users.id, PILOT_USER_ID)).limit(1);
  if (existing.length === 0) {
    await db.insert(users).values({
      id: PILOT_USER_ID,
      email,
      displayName: process.env.PILOT_DISPLAY_NAME ?? "Michael",
      timezone: "Australia/Sydney",
      onboardingState: "started",
    });
  }

  const controls = await db
    .select()
    .from(controlState)
    .where(eq(controlState.userId, PILOT_USER_ID))
    .limit(1);
  if (controls.length === 0) {
    await db.insert(controlState).values({
      userId: PILOT_USER_ID,
      paused: DEFAULT_CONTROLS.paused,
      pauseUntil: null,
      revision: DEFAULT_CONTROLS.revision,
      quietHoursStart: DEFAULT_CONTROLS.quietHoursStart,
      quietHoursEnd: DEFAULT_CONTROLS.quietHoursEnd,
      maxMessagesPerDay: DEFAULT_CONTROLS.maxMessagesPerDay,
      minSpacingMinutes: DEFAULT_CONTROLS.minSpacingMinutes,
      activityLevel: DEFAULT_CONTROLS.activityLevel,
      channelPrefs: DEFAULT_CONTROLS.channelPrefs,
    });
  }

  const connCount = await db
    .select()
    .from(connections)
    .where(eq(connections.userId, PILOT_USER_ID));
  if (connCount.length === 0) {
    const providers = [
      "gmail",
      "google_calendar",
      "ont_crm",
      "notes",
      "research",
    ] as const;
    for (const provider of providers) {
      await db.insert(connections).values({
        id: `conn_${provider}`,
        userId: PILOT_USER_ID,
        provider,
        status: "disconnected",
        scopes: [],
        fixture: false,
      });
    }
  }

  return { userId: PILOT_USER_ID, email };
}

export async function getControls(userId: string): Promise<DeliveryControls> {
  const db = await getDb();
  await ensurePilotUser();
  const rows = await db
    .select()
    .from(controlState)
    .where(eq(controlState.userId, userId))
    .limit(1);
  const row = rows[0];
  if (!row) throw new Error("controls missing");
  return {
    userId,
    paused: row.paused,
    pauseUntil: row.pauseUntil ? row.pauseUntil.toISOString() : null,
    revision: row.revision,
    quietHoursStart: row.quietHoursStart,
    quietHoursEnd: row.quietHoursEnd,
    timezone: "Australia/Sydney",
    maxMessagesPerDay: row.maxMessagesPerDay,
    minSpacingMinutes: row.minSpacingMinutes,
    activityLevel: row.activityLevel as DeliveryControls["activityLevel"],
    channelPrefs: row.channelPrefs,
  };
}

export async function pauseUser(userId: string, until: string | null = null) {
  const db = await getDb();
  const current = await getControls(userId);
  const nextRevision = current.revision + 1;
  await db
    .update(controlState)
    .set({
      paused: true,
      pauseUntil: until ? new Date(until) : null,
      revision: nextRevision,
      updatedAt: new Date(),
    })
    .where(eq(controlState.userId, userId));
  await db.insert(auditEvents).values({
    id: randomUUID(),
    userId,
    action: "pause",
    actor: userId,
    details: { until, revision: nextRevision },
  });
  return getControls(userId);
}

export async function resumeUser(userId: string) {
  const db = await getDb();
  const current = await getControls(userId);
  const nextRevision = current.revision + 1;
  await db
    .update(controlState)
    .set({
      paused: false,
      pauseUntil: null,
      revision: nextRevision,
      updatedAt: new Date(),
    })
    .where(eq(controlState.userId, userId));
  await db.insert(auditEvents).values({
    id: randomUUID(),
    userId,
    action: "resume",
    actor: userId,
    details: { revision: nextRevision },
  });
  return getControls(userId);
}

export async function updateControls(
  userId: string,
  patch: Partial<{
    quietHoursStart: string;
    quietHoursEnd: string;
    maxMessagesPerDay: number;
    minSpacingMinutes: number;
    activityLevel: string;
    channelPrefs: DeliveryControls["channelPrefs"];
  }>,
) {
  const db = await getDb();
  await db
    .update(controlState)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(controlState.userId, userId));
  return getControls(userId);
}

export async function listPreferences(userId: string) {
  const db = await getDb();
  return db
    .select()
    .from(preferences)
    .where(eq(preferences.userId, userId))
    .orderBy(desc(preferences.createdAt));
}

export async function preferenceAdjustments(userId: string): Promise<PreferenceAdjustment[]> {
  const rows = await listPreferences(userId);
  return rows.map((r) => ({
    topic: r.topic,
    delta: r.weight / 100,
    polarity: r.polarity as PreferenceAdjustment["polarity"],
    expiresAt: r.expiresAt ? r.expiresAt.toISOString() : null,
    note: r.provenance ?? undefined,
  }));
}

export async function listFacts(userId: string) {
  const db = await getDb();
  return db
    .select()
    .from(facts)
    .where(and(eq(facts.userId, userId), eq(facts.tombstoned, false)))
    .orderBy(desc(facts.updatedAt));
}

export async function upsertFact(
  userId: string,
  input: {
    entity: string;
    attribute: string;
    value: string;
    sourceRefs?: string[];
    confidence?: number;
    explicit?: boolean;
  },
) {
  const db = await getDb();
  const id = randomUUID();
  await db.insert(facts).values({
    id,
    userId,
    entity: input.entity,
    attribute: input.attribute,
    value: input.value,
    sourceRefs: input.sourceRefs ?? ["conversation"],
    confidence: input.confidence ?? 80,
    explicit: input.explicit ?? true,
  });
  return id;
}

export async function deleteFact(userId: string, factId: string) {
  const db = await getDb();
  await db
    .update(facts)
    .set({ tombstoned: true, updatedAt: new Date() })
    .where(and(eq(facts.id, factId), eq(facts.userId, userId)));
}

export async function listConnections(userId: string) {
  const db = await getDb();
  return db.select().from(connections).where(eq(connections.userId, userId));
}

export async function applyFeedbackCommand(input: {
  userId: string;
  text: string;
  idempotencyKey: string;
  topicHint?: string;
  suggestionId?: string;
}) {
  const db = await getDb();
  const existing = await db
    .select()
    .from(feedbackEvents)
    .where(eq(feedbackEvents.idempotencyKey, input.idempotencyKey))
    .limit(1);
  if (existing[0]) {
    return {
      duplicate: true as const,
      kind: existing[0].kind,
      acknowledgement: existing[0].acknowledgement,
      controls: await getControls(input.userId),
    };
  }

  const controls = await getControls(input.userId);
  const command = parseFeedback(input.text, {
    now: new Date(),
    timezone: controls.timezone,
    topicHint: input.topicHint,
    suggestionId: input.suggestionId,
  });

  if (command.kind === "pause") {
    await pauseUser(input.userId, null);
  } else if (command.kind === "leave_alone_until") {
    await pauseUser(input.userId, command.resolvedAt ?? null);
  } else if (command.kind === "resume") {
    await resumeUser(input.userId);
  }

  if (command.preference) {
    await db.insert(preferences).values({
      id: randomUUID(),
      userId: input.userId,
      topic: String(command.preference.topic),
      polarity: command.preference.polarity,
      weight: Math.round(command.preference.delta * 100),
      explicit: true,
      provenance: command.preference.note ?? command.kind,
      expiresAt: command.preference.expiresAt
        ? new Date(command.preference.expiresAt)
        : null,
    });
  }

  if (command.kind === "remind_me" && command.resolvedAt) {
    await db.insert(reminders).values({
      id: randomUUID(),
      userId: input.userId,
      suggestionId: command.targetSuggestionId,
      localPhrase: command.originalPhrase,
      fireAt: new Date(command.resolvedAt),
      timezone: controls.timezone,
      status: "scheduled",
    });
  }

  await db.insert(feedbackEvents).values({
    id: randomUUID(),
    userId: input.userId,
    idempotencyKey: input.idempotencyKey,
    kind: command.kind,
    targetSuggestionId: command.targetSuggestionId,
    originalPhrase: command.originalPhrase,
    acknowledgement: command.acknowledgement || "Noted.",
    payload: command,
  });

  return {
    duplicate: false as const,
    kind: command.kind,
    acknowledgement: command.acknowledgement || "Noted.",
    controls: await getControls(input.userId),
    command,
  };
}

export async function listCandidates(userId: string) {
  const db = await getDb();
  return db
    .select()
    .from(candidates)
    .where(eq(candidates.userId, userId))
    .orderBy(desc(candidates.createdAt));
}

export async function saveCandidate(userId: string, candidate: {
  id?: string;
  topic: string;
  title: string;
  opener: string;
  details: string;
  reasonForUser: string;
  reasonNow: string;
  evidence: unknown;
  relevance: number;
  timing: number;
  novelty: number;
  effort?: number;
  expiresAt?: string | null;
  dedupeKey: string;
  urgent?: boolean;
  fixture?: boolean;
}) {
  const db = await getDb();
  const id = candidate.id ?? randomUUID();
  await db.insert(candidates).values({
    id,
    userId,
    topic: candidate.topic,
    title: candidate.title,
    opener: candidate.opener,
    details: candidate.details,
    reasonForUser: candidate.reasonForUser,
    reasonNow: candidate.reasonNow,
    evidence: candidate.evidence,
    relevance: Math.round(candidate.relevance * 100),
    timing: Math.round(candidate.timing * 100),
    novelty: Math.round(candidate.novelty * 100),
    effort: Math.round((candidate.effort ?? 0.5) * 100),
    expiresAt: candidate.expiresAt ? new Date(candidate.expiresAt) : null,
    dedupeKey: candidate.dedupeKey,
    urgent: candidate.urgent ?? false,
    fixture: candidate.fixture ?? false,
  });
  return id;
}

export async function proactiveAllowed(userId: string): Promise<boolean> {
  const controls = await getControls(userId);
  return !isPaused(controls);
}
