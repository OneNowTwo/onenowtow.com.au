import type { Candidate } from "../domain/types";

/** Clearly labelled development fixtures — never show as live. */
export function loadFixtureCandidates(userId: string): Candidate[] {
  const now = Date.now();
  return [
    {
      id: "fix_paddo_schnitty",
      userId,
      topic: "food",
      title: "Paddo 2-for-1 schnitty (FIXTURE)",
      opener:
        "Just saw there's a two-for-one schnitty night at the Paddo tomorrow. Keen to hear more?",
      details:
        "FIXTURE ONLY — not a live offer. Hypothetical: Paddington Inn, tomorrow evening, two-for-one schnitzel. No booking invented. Source: fixture venue page.",
      reasonForUser: "Example after-hours food suggestion for progressive disclosure.",
      reasonNow: "Tomorrow night window in the fixture calendar.",
      evidence: {
        sourceUrl: "https://fixture.local/paddo-schnitty",
        sourceLabel: "FIXTURE venue page",
        fetchedAt: new Date(now).toISOString(),
        excerpt: "2-for-1 schnitzel night — fixture",
        verified: true,
        staleAfter: new Date(now + 2 * 86400_000).toISOString(),
      },
      relevance: 0.82,
      timing: 0.75,
      novelty: 0.88,
      effort: 0.35,
      expiresAt: new Date(now + 2 * 86400_000).toISOString(),
      dedupeKey: "fixture-paddo-schnitty",
      fixture: true,
      createdAt: new Date(now).toISOString(),
    },
    {
      id: "fix_retainer_article",
      userId,
      topic: "research",
      title: "Agency retainer pricing breakdown (FIXTURE)",
      opener:
        "Found a breakdown of how another agency prices monthly content. Looks relevant to the retainer idea. Want a look?",
      details:
        "FIXTURE ONLY. Hypothetical article connecting monthly content retainers to packaging and scope boundaries — useful if exploring retainers for ONT.",
      reasonForUser: "Michael is exploring business ideas including retainers.",
      reasonNow: "Active exploration; article is concrete and actionable.",
      evidence: {
        sourceUrl: "https://fixture.local/retainer-pricing",
        sourceLabel: "FIXTURE article",
        fetchedAt: new Date(now).toISOString(),
        verified: true,
        staleAfter: new Date(now + 14 * 86400_000).toISOString(),
      },
      relevance: 0.78,
      timing: 0.6,
      novelty: 0.7,
      effort: 0.4,
      dedupeKey: "fixture-retainer-article",
      fixture: true,
      createdAt: new Date(now).toISOString(),
    },
    {
      id: "fix_urgent_deadline",
      userId,
      topic: "work",
      title: "Quote deadline (FIXTURE)",
      opener:
        "The Arissa quote fixture is due tomorrow 10am — still marked open in CRM. Want help closing it, or move the date?",
      details:
        "FIXTURE ONLY. Urgent work item must state deadline upfront, not hide behind a teaser.",
      reasonForUser: "Open commercial follow-up.",
      reasonNow: "Deadline within 24h in fixture data.",
      evidence: {
        sourceUrl: "https://fixture.local/crm/arissa-quote",
        sourceLabel: "FIXTURE CRM row",
        fetchedAt: new Date(now).toISOString(),
        verified: true,
        staleAfter: new Date(now + 86400_000).toISOString(),
      },
      relevance: 0.95,
      timing: 0.95,
      novelty: 0.4,
      effort: 0.5,
      urgent: true,
      dedupeKey: "fixture-arissa-quote-deadline",
      fixture: true,
      createdAt: new Date(now).toISOString(),
    },
  ];
}
