import { describe, expect, it } from "vitest";
import {
  DEFAULT_CONTROLS,
  InMemoryDispatchGate,
  evidenceOk,
  gateCandidate,
  inQuietHours,
  localDateKey,
  selectBestCandidate,
  scoreCandidate,
} from "../src/domain/policy";
import type { Candidate, DeliveryControls } from "../src/domain/types";

function baseCandidate(over: Partial<Candidate> = {}): Candidate {
  return {
    id: "cand_1",
    userId: "user_michael",
    topic: "food",
    title: "Schnitty night",
    opener: "Just saw there's a two-for-one schnitty night at the Paddo tomorrow. Keen to hear more?",
    details: "Paddington Inn, tomorrow, 2-for-1 schnitzel. Source: venue page.",
    reasonForUser: "You like local food deals near the inner east.",
    reasonNow: "It's tomorrow night and your calendar looks open after 6.",
    evidence: {
      sourceUrl: "https://example.test/paddo-schnitty",
      sourceLabel: "FIXTURE venue page",
      fetchedAt: new Date().toISOString(),
      verified: true,
      staleAfter: new Date(Date.now() + 86400_000).toISOString(),
    },
    relevance: 0.8,
    timing: 0.7,
    novelty: 0.9,
    effort: 0.3,
    dedupeKey: "paddo-schnitty-2026-10-15",
    fixture: true,
    createdAt: new Date().toISOString(),
    ...over,
  };
}

function controls(over: Partial<DeliveryControls> = {}): DeliveryControls {
  return {
    userId: "user_michael",
    ...DEFAULT_CONTROLS,
    ...over,
  };
}

describe("evidence freshness", () => {
  it("rejects unverified evidence", () => {
    const c = baseCandidate({
      evidence: {
        fetchedAt: new Date().toISOString(),
        verified: false,
      },
    });
    expect(evidenceOk(c)).toBe(false);
  });

  it("rejects stale evidence", () => {
    const c = baseCandidate({
      evidence: {
        fetchedAt: new Date().toISOString(),
        verified: true,
        staleAfter: new Date(Date.now() - 1000).toISOString(),
      },
    });
    expect(evidenceOk(c)).toBe(false);
  });
});

describe("quiet hours Australia/Sydney", () => {
  it("treats 22:00 Sydney as quiet", () => {
    // 2026-10-14 11:00 UTC = 22:00 AEDT
    const now = new Date("2026-10-14T11:00:00.000Z");
    expect(inQuietHours(controls(), now)).toBe(true);
  });

  it("treats 10:00 Sydney as open", () => {
    // 2026-10-14 00:00 UTC ≈ 11:00 AEDT
    const now = new Date("2026-10-13T23:00:00.000Z");
    expect(inQuietHours(controls(), now)).toBe(false);
  });
});

describe("selection and scoring", () => {
  it("selects the highest scoring eligible candidate", () => {
    const a = baseCandidate({ id: "a", relevance: 0.5, novelty: 0.2, dedupeKey: "a" });
    const b = baseCandidate({ id: "b", relevance: 0.9, novelty: 0.9, dedupeKey: "b" });
    const best = selectBestCandidate([a, b], {
      controls: controls(),
      now: new Date("2026-10-14T01:00:00.000Z"),
    });
    expect(best?.id).toBe("b");
    expect(best?.selected).toBe(true);
  });

  it("blocks fabrication when evidence missing", () => {
    const c = baseCandidate({
      evidence: { fetchedAt: new Date().toISOString(), verified: false },
    });
    const gate = gateCandidate(c, {
      controls: controls(),
      now: new Date("2026-10-14T01:00:00.000Z"),
    });
    expect(gate.ok).toBe(false);
    expect(gate.reasons).toContain("evidence_or_expiry");
  });

  it("applies less_of_this without silencing other topics", () => {
    const food = baseCandidate({ topic: "food", relevance: 0.6 });
    const work = baseCandidate({
      id: "w",
      topic: "work",
      relevance: 0.6,
      dedupeKey: "work-1",
    });
    const adjustments = [
      { topic: "food", delta: -0.5, polarity: "reduce" as const },
    ];
    expect(scoreCandidate(food, adjustments)).toBeLessThan(scoreCandidate(work, adjustments));
  });
});

describe("pause race", () => {
  it("blocks dispatch after pause commits even if reservation started", () => {
    const gate = new InMemoryDispatchGate();
    gate.setControls(controls({ revision: 1 }));
    const candidate = baseCandidate();
    const now = "2026-10-14T01:00:00.000Z";

    const paused = gate.pause("user_michael");
    expect(paused.revision).toBe(2);

    const decision = gate.tryDispatch(
      {
        userId: "user_michael",
        candidateId: candidate.id,
        channel: "in_app",
        idempotencyKey: "msg-1",
        policyRevision: 1, // stale
        at: now,
      },
      candidate,
    );
    expect(decision.allowed).toBe(false);
    expect(decision.reasons).toContain("stale_policy_revision");
  });

  it("allows dispatch when revision matches and not paused", () => {
    const gate = new InMemoryDispatchGate();
    gate.setControls(controls({ revision: 3 }));
    const candidate = baseCandidate();
    const decision = gate.tryDispatch(
      {
        userId: "user_michael",
        candidateId: candidate.id,
        channel: "in_app",
        idempotencyKey: "msg-2",
        policyRevision: 3,
        at: "2026-10-14T01:00:00.000Z",
      },
      candidate,
    );
    expect(decision.allowed).toBe(true);
  });

  it("does not double-spend daily budget on duplicate idempotency key", () => {
    const gate = new InMemoryDispatchGate();
    gate.setControls(controls({ revision: 1, maxMessagesPerDay: 1 }));
    const candidate = baseCandidate();
    const attempt = {
      userId: "user_michael",
      candidateId: candidate.id,
      channel: "in_app" as const,
      idempotencyKey: "same",
      policyRevision: 1,
      at: "2026-10-14T01:00:00.000Z",
    };
    expect(gate.tryDispatch(attempt, candidate).allowed).toBe(true);
    expect(gate.tryDispatch(attempt, candidate).allowed).toBe(false);
  });
});

describe("local date key", () => {
  it("rolls midnight budgets in Sydney", () => {
    const before = new Date("2026-10-13T13:30:00.000Z"); // ~00:30 AEDT next day
    const after = new Date("2026-10-13T12:30:00.000Z");
    expect(localDateKey(before, "Australia/Sydney")).not.toBe(
      localDateKey(after, "UTC"),
    );
  });
});
