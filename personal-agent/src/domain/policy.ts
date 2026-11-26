/**
 * Delivery policy — behavioural foundation from the Cursor starter brief.
 *
 * Hard gates precede ranking. Pause, quiet hours, budget, spacing, evidence,
 * and dedupe are deterministic application code the model cannot overrule.
 *
 * The in-memory gate here tests policy intent. Production dispatch uses the
 * transactional outbox + DB control_state (see src/server).
 */

import type {
  Candidate,
  DeliveryControls,
  DispatchAttempt,
  DispatchDecision,
  PreferenceAdjustment,
  RankedCandidate,
} from "./types";

const WEIGHTS = { relevance: 0.55, timing: 0.25, novelty: 0.2 } as const;

export const DEFAULT_CONTROLS: Omit<DeliveryControls, "userId"> = {
  paused: false,
  pauseUntil: null,
  revision: 1,
  quietHoursStart: "21:00",
  quietHoursEnd: "08:00",
  timezone: "Australia/Sydney",
  maxMessagesPerDay: 3,
  minSpacingMinutes: 120,
  activityLevel: "balanced",
  channelPrefs: { inApp: true, webPush: false, sms: false },
};

export function isPaused(controls: DeliveryControls, now: Date = new Date()): boolean {
  if (!controls.paused) return false;
  if (!controls.pauseUntil) return true;
  return now.getTime() < new Date(controls.pauseUntil).getTime();
}

/** Local wall-clock HH:mm inside quiet hours (Sydney-aware via Intl). */
export function inQuietHours(
  controls: DeliveryControls,
  now: Date = new Date(),
): boolean {
  const local = formatLocalHm(now, controls.timezone);
  const { quietHoursStart: start, quietHoursEnd: end } = controls;
  if (start === end) return false;
  // Overnight window e.g. 21:00–08:00
  if (start > end) {
    return local >= start || local < end;
  }
  return local >= start && local < end;
}

export function formatLocalHm(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-AU", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const hour = parts.find((p) => p.type === "hour")?.value ?? "00";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "00";
  return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
}

export function localDateKey(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  const d = parts.find((p) => p.type === "day")?.value;
  return `${y}-${m}-${d}`;
}

export function evidenceOk(candidate: Candidate, now: Date = new Date()): boolean {
  if (!candidate.evidence?.verified) return false;
  if (candidate.evidence.staleAfter) {
    if (now.getTime() > new Date(candidate.evidence.staleAfter).getTime()) {
      return false;
    }
  }
  if (candidate.expiresAt) {
    if (now.getTime() > new Date(candidate.expiresAt).getTime()) {
      return false;
    }
  }
  return true;
}

export function applyPreferenceAdjustments(
  baseRelevance: number,
  topic: string,
  adjustments: PreferenceAdjustment[],
  now: Date = new Date(),
): number {
  let score = baseRelevance;
  for (const adj of adjustments) {
    if (adj.expiresAt && now.getTime() > new Date(adj.expiresAt).getTime()) continue;
    if (String(adj.topic) !== String(topic)) continue;
    if (adj.polarity === "suppress") return 0;
    score += adj.delta;
  }
  return Math.max(0, Math.min(1, score));
}

export function scoreCandidate(
  candidate: Candidate,
  adjustments: PreferenceAdjustment[] = [],
  now: Date = new Date(),
): number {
  const relevance = applyPreferenceAdjustments(
    candidate.relevance,
    String(candidate.topic),
    adjustments,
    now,
  );
  return (
    relevance * WEIGHTS.relevance +
    candidate.timing * WEIGHTS.timing +
    candidate.novelty * WEIGHTS.novelty
  );
}

export interface GateContext {
  controls: DeliveryControls;
  adjustments?: PreferenceAdjustment[];
  sentDedupeKeys?: Set<string>;
  messagesSentToday?: number;
  lastSentAt?: string | null;
  now?: Date;
}

export function gateCandidate(
  candidate: Candidate,
  ctx: GateContext,
): { ok: boolean; reasons: string[] } {
  const now = ctx.now ?? new Date();
  const reasons: string[] = [];

  if (candidate.userId !== ctx.controls.userId) {
    reasons.push("wrong_user");
  }
  if (isPaused(ctx.controls, now)) {
    reasons.push("paused");
  }
  if (!evidenceOk(candidate, now)) {
    reasons.push("evidence_or_expiry");
  }
  if (inQuietHours(ctx.controls, now) && !candidate.urgent) {
    reasons.push("quiet_hours");
  }
  if ((ctx.messagesSentToday ?? 0) >= ctx.controls.maxMessagesPerDay) {
    reasons.push("daily_budget");
  }
  if (ctx.lastSentAt) {
    const elapsedMin =
      (now.getTime() - new Date(ctx.lastSentAt).getTime()) / 60_000;
    if (elapsedMin < ctx.controls.minSpacingMinutes && !candidate.urgent) {
      reasons.push("spacing");
    }
  }
  if (ctx.sentDedupeKeys?.has(candidate.dedupeKey)) {
    reasons.push("dedupe");
  }
  const relevance = applyPreferenceAdjustments(
    candidate.relevance,
    String(candidate.topic),
    ctx.adjustments ?? [],
    now,
  );
  if (relevance < 0.25 && !candidate.urgent) {
    reasons.push("low_relevance");
  }

  return { ok: reasons.length === 0, reasons };
}

/** Select the single best candidate that passes hard gates. */
export function selectBestCandidate(
  candidates: Candidate[],
  ctx: GateContext,
): RankedCandidate | null {
  const now = ctx.now ?? new Date();
  const ranked: RankedCandidate[] = candidates.map((c) => {
    const gate = gateCandidate(c, { ...ctx, now });
    return {
      ...c,
      score: scoreCandidate(c, ctx.adjustments ?? [], now),
      gateReasons: gate.reasons,
      selected: false,
    };
  });

  const eligible = ranked
    .filter((r) => r.gateReasons.length === 0)
    .sort((a, b) => b.score - a.score);

  if (eligible.length === 0) return null;
  const best = { ...eligible[0], selected: true };
  return best;
}

/**
 * In-memory dispatch recheck: prove pause revision wins the race before transport.
 * Not a production outbox.
 */
export class InMemoryDispatchGate {
  private controlsByUser = new Map<string, DeliveryControls>();
  private dailyCounts = new Map<string, { day: string; count: number }>();
  private lastSent = new Map<string, string>();
  private sentKeys = new Map<string, Set<string>>();
  private reserved = new Set<string>();

  setControls(controls: DeliveryControls): void {
    this.controlsByUser.set(controls.userId, { ...controls });
  }

  getControls(userId: string): DeliveryControls | undefined {
    const c = this.controlsByUser.get(userId);
    return c ? { ...c } : undefined;
  }

  pause(userId: string, until: string | null = null): DeliveryControls {
    const current = this.controlsByUser.get(userId);
    if (!current) throw new Error(`unknown user ${userId}`);
    const next: DeliveryControls = {
      ...current,
      paused: true,
      pauseUntil: until,
      revision: current.revision + 1,
    };
    this.controlsByUser.set(userId, next);
    // Cancel reservations for this user
    for (const key of [...this.reserved]) {
      if (key.startsWith(`${userId}:`)) this.reserved.delete(key);
    }
    return { ...next };
  }

  resume(userId: string): DeliveryControls {
    const current = this.controlsByUser.get(userId);
    if (!current) throw new Error(`unknown user ${userId}`);
    const next: DeliveryControls = {
      ...current,
      paused: false,
      pauseUntil: null,
      revision: current.revision + 1,
    };
    this.controlsByUser.set(userId, next);
    return { ...next };
  }

  /** Atomic-ish reserve: recheck controls + budget immediately before "send". */
  tryDispatch(
    attempt: DispatchAttempt,
    candidate: Candidate,
    adjustments: PreferenceAdjustment[] = [],
  ): DispatchDecision {
    const controls = this.controlsByUser.get(attempt.userId);
    if (!controls) {
      return { allowed: false, reasons: ["unknown_user"], reservedDailySlot: false };
    }
    if (attempt.policyRevision !== controls.revision) {
      return {
        allowed: false,
        reasons: ["stale_policy_revision"],
        reservedDailySlot: false,
      };
    }
    if (this.reserved.has(attempt.idempotencyKey)) {
      return { allowed: false, reasons: ["duplicate_idempotency"], reservedDailySlot: false };
    }

    const now = new Date(attempt.at);
    const day = localDateKey(now, controls.timezone);
    const bucket = this.dailyCounts.get(attempt.userId);
    const messagesSentToday =
      bucket && bucket.day === day ? bucket.count : 0;
    const sent = this.sentKeys.get(attempt.userId) ?? new Set<string>();

    const gate = gateCandidate(candidate, {
      controls,
      adjustments,
      messagesSentToday,
      lastSentAt: this.lastSent.get(attempt.userId) ?? null,
      sentDedupeKeys: sent,
      now,
    });

    if (!gate.ok) {
      return { allowed: false, reasons: gate.reasons, reservedDailySlot: false };
    }

    this.reserved.add(attempt.idempotencyKey);
    this.dailyCounts.set(attempt.userId, {
      day,
      count: messagesSentToday + 1,
    });
    this.lastSent.set(attempt.userId, attempt.at);
    sent.add(candidate.dedupeKey);
    this.sentKeys.set(attempt.userId, sent);

    return { allowed: true, reasons: [], reservedDailySlot: true };
  }
}

export function craftOpener(candidate: Candidate): string {
  if (candidate.urgent) {
    return candidate.opener;
  }
  return candidate.opener.trim();
}
