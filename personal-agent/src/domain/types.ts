/** Shared product types for Personal Agent (Milestone 1+). */

export type ActivityLevel = "quiet" | "balanced" | "proactive";

export type CandidateTopic =
  | "work"
  | "food"
  | "outdoors"
  | "film"
  | "training"
  | "research"
  | "social"
  | "other";

export type FeedbackIntentKind =
  | "less_of_this"
  | "good_find"
  | "not_this_week"
  | "not_my_thing"
  | "remind_me"
  | "flat_today"
  | "leave_alone_until"
  | "pause"
  | "resume"
  | "unknown";

export interface PreferenceAdjustment {
  topic: CandidateTopic | string;
  delta: number;
  polarity: "prefer" | "reduce" | "suppress";
  expiresAt?: string | null;
  note?: string;
}

export interface DeliveryControls {
  userId: string;
  paused: boolean;
  pauseUntil: string | null;
  revision: number;
  quietHoursStart: string; // HH:mm local
  quietHoursEnd: string;
  timezone: string;
  maxMessagesPerDay: number;
  minSpacingMinutes: number;
  activityLevel: ActivityLevel;
  channelPrefs: {
    inApp: boolean;
    webPush: boolean;
    sms: boolean;
  };
}

export interface CandidateEvidence {
  sourceUrl?: string;
  sourceLabel?: string;
  fetchedAt: string;
  excerpt?: string;
  verified: boolean;
  staleAfter?: string | null;
}

export interface Candidate {
  id: string;
  userId: string;
  topic: CandidateTopic | string;
  title: string;
  opener: string;
  details: string;
  reasonForUser: string;
  reasonNow: string;
  evidence: CandidateEvidence;
  relevance: number; // 0..1
  timing: number; // 0..1
  novelty: number; // 0..1
  effort: number; // 0..1 lower is easier
  expiresAt?: string | null;
  dedupeKey: string;
  urgent?: boolean;
  fixture?: boolean;
  createdAt: string;
}

export interface RankedCandidate extends Candidate {
  score: number;
  gateReasons: string[];
  selected: boolean;
}

export interface FeedbackCommand {
  kind: FeedbackIntentKind;
  topic?: CandidateTopic | string;
  targetSuggestionId?: string;
  resolvedAt?: string | null;
  originalPhrase: string;
  acknowledgement: string;
  preference?: PreferenceAdjustment;
  confidence: number;
}

export interface DispatchAttempt {
  userId: string;
  candidateId: string;
  channel: "in_app" | "web_push" | "sms";
  idempotencyKey: string;
  policyRevision: number;
  at: string;
}

export interface DispatchDecision {
  allowed: boolean;
  reasons: string[];
  reservedDailySlot: boolean;
}
