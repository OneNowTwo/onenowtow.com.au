/**
 * Deterministic intent parsing for ordinary conversational feedback.
 * Explicit stop/pause has a fast path before any LLM call.
 */

import type { FeedbackCommand, FeedbackIntentKind, PreferenceAdjustment } from "./types";

const STOP_RE =
  /\b(stop|pause|leave me alone|shut up|go away|quiet(?:\s+please)?)\b/i;
const RESUME_RE = /\b(resume|unpause|come back|i'?m back)\b/i;
const LESS_RE = /\bless of (this|that|these|those)\b|\bfewer\b|\btoo many\b/i;
const GOOD_RE = /\b(good find|nice one|keep (an eye|these)|love (this|that))\b/i;
const NOT_WEEK_RE = /\bnot this week\b|\blater\b|\bnext week\b/i;
const NOT_THING_RE = /\bnot my thing\b|\bnot interested\b|\bnope\b|\bhate (this|that)\b/i;
const REMIND_RE = /\bremind me\b/i;
const FLAT_RE = /\bi'?m flat\b|\bfeeling flat\b|\blow energy\b|\bexhausted\b/i;
const UNTIL_RE =
  /\bleave me alone until\b|\bpause until\b|\bquiet until\b|\buntil (monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i;

export interface ParseFeedbackOptions {
  now: Date;
  timezone?: string;
  topicHint?: string;
  suggestionId?: string;
  defaultReminderHour?: number;
}

function endOfLocalDay(now: Date, timeZone: string): string {
  // Approximate: add hours until local date rolls — good enough for pilot expiry.
  const key = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  // Store as ISO of next local midnight roughly via iterative approach
  let t = new Date(now);
  for (let i = 0; i < 48; i++) {
    t = new Date(t.getTime() + 30 * 60_000);
    const nextKey = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(t);
    if (nextKey !== key) {
      // snap back to start of that hour
      return new Date(t.getTime() - (t.getMinutes() * 60_000 + t.getSeconds() * 1000)).toISOString();
    }
  }
  return new Date(now.getTime() + 12 * 3600_000).toISOString();
}

function nextWeekdayAt(
  now: Date,
  weekdayName: string,
  hour: number,
  timeZone: string,
): string {
  const map: Record<string, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };
  const target = map[weekdayName.toLowerCase()];
  if (target === undefined) {
    return new Date(now.getTime() + 24 * 3600_000).toISOString();
  }

  // Walk forward day-by-day in the user's timezone
  let cursor = new Date(now.getTime());
  for (let i = 0; i < 14; i++) {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(cursor);
    const weekday = parts.find((p) => p.type === "weekday")?.value?.toLowerCase();
    const h = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
    if (weekday === weekdayName.toLowerCase() && (i > 0 || h < hour)) {
      // Approximate target by advancing to roughly that local hour
      const deltaHours = hour - h;
      return new Date(cursor.getTime() + deltaHours * 3600_000).toISOString();
    }
    cursor = new Date(cursor.getTime() + 3600_000);
  }
  return new Date(now.getTime() + 7 * 24 * 3600_000).toISOString();
}

function extractWeekday(text: string): string | null {
  const m = text.match(
    /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,
  );
  return m ? m[1].toLowerCase() : null;
}

function topicLabel(topic?: string): string {
  if (!topic) return "this";
  if (topic === "food") return "food deals";
  return String(topic);
}

export function parseFeedback(
  text: string,
  opts: ParseFeedbackOptions,
): FeedbackCommand {
  const raw = text.trim();
  const timezone = opts.timezone ?? "Australia/Sydney";
  const topic = opts.topicHint ?? "other";
  const lower = raw.toLowerCase();

  // Fast path: stop / pause before any softer interpretation
  if (STOP_RE.test(raw) && !UNTIL_RE.test(raw) && !RESUME_RE.test(raw)) {
    const untilMatch = lower.match(/until\s+(\w+)/);
    if (untilMatch && extractWeekday(raw)) {
      // fall through to leave_alone_until
    } else {
      return {
        kind: "pause",
        originalPhrase: raw,
        acknowledgement: "Paused. I'll wait until you tell me otherwise.",
        resolvedAt: null,
        confidence: 0.99,
        targetSuggestionId: opts.suggestionId,
      };
    }
  }

  if (RESUME_RE.test(raw)) {
    return {
      kind: "resume",
      originalPhrase: raw,
      acknowledgement: "Back on. I'll keep it relevant.",
      confidence: 0.95,
    };
  }

  if (UNTIL_RE.test(raw) || (STOP_RE.test(raw) && extractWeekday(raw))) {
    const day = extractWeekday(raw) ?? "monday";
    const resolved = nextWeekdayAt(opts.now, day, opts.defaultReminderHour ?? 9, timezone);
    return {
      kind: "leave_alone_until",
      originalPhrase: raw,
      acknowledgement: `Done. Quiet until ${capitalize(day)} at ${opts.defaultReminderHour ?? 9}am.`,
      resolvedAt: resolved,
      confidence: 0.9,
    };
  }

  if (FLAT_RE.test(raw)) {
    const expires = endOfLocalDay(opts.now, timezone);
    const preference: PreferenceAdjustment = {
      topic: "work",
      delta: -0.15,
      polarity: "reduce",
      expiresAt: expires,
      note: "temporary_flat_mood",
    };
    return {
      kind: "flat_today",
      originalPhrase: raw,
      acknowledgement: "Fair enough. Want a low-effort option, or some quiet?",
      preference,
      resolvedAt: expires,
      confidence: 0.9,
    };
  }

  if (REMIND_RE.test(raw)) {
    const day = extractWeekday(raw) ?? "friday";
    const resolved = nextWeekdayAt(opts.now, day, opts.defaultReminderHour ?? 9, timezone);
    return {
      kind: "remind_me",
      originalPhrase: raw,
      acknowledgement: `${capitalize(day)} at ${opts.defaultReminderHour ?? 9}am—done.`,
      resolvedAt: resolved,
      targetSuggestionId: opts.suggestionId,
      confidence: 0.85,
    };
  }

  if (LESS_RE.test(raw)) {
    const preference: PreferenceAdjustment = {
      topic,
      delta: -0.2,
      polarity: "reduce",
      note: "less_of_this",
    };
    return {
      kind: "less_of_this",
      topic,
      originalPhrase: raw,
      acknowledgement: `Yep, fewer ${topicLabel(topic)}.`,
      preference,
      targetSuggestionId: opts.suggestionId,
      confidence: 0.9,
    };
  }

  if (GOOD_RE.test(raw)) {
    const preference: PreferenceAdjustment = {
      topic,
      delta: 0.08,
      polarity: "prefer",
      note: "good_find",
    };
    return {
      kind: "good_find",
      topic,
      originalPhrase: raw,
      acknowledgement: "Nice, I'll keep an eye out for similar things.",
      preference,
      targetSuggestionId: opts.suggestionId,
      confidence: 0.88,
    };
  }

  if (NOT_WEEK_RE.test(raw)) {
    const preference: PreferenceAdjustment = {
      topic,
      delta: -0.1,
      polarity: "reduce",
      expiresAt: new Date(opts.now.getTime() + 7 * 24 * 3600_000).toISOString(),
      note: "not_this_week",
    };
    return {
      kind: "not_this_week",
      topic,
      originalPhrase: raw,
      acknowledgement: "No worries, I'll leave it for now.",
      preference,
      targetSuggestionId: opts.suggestionId,
      confidence: 0.85,
    };
  }

  if (NOT_THING_RE.test(raw)) {
    return {
      kind: "not_my_thing",
      topic,
      originalPhrase: raw,
      acknowledgement: "Got it. Is it that venue, or this kind of thing generally?",
      targetSuggestionId: opts.suggestionId,
      confidence: 0.8,
      preference: {
        topic,
        delta: -1,
        polarity: "suppress",
        note: "not_my_thing_pending_scope",
      },
    };
  }

  return {
    kind: "unknown",
    originalPhrase: raw,
    acknowledgement: "",
    confidence: 0.2,
  };
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function isControlIntent(kind: FeedbackIntentKind): boolean {
  return kind === "pause" || kind === "resume" || kind === "leave_alone_until";
}
