import { defineTool } from "eve/tools";
import { z } from "zod";
import { craftOpener, selectBestCandidate } from "../../src/domain/policy";
import type { Candidate } from "../../src/domain/types";
import {
  ensurePilotUser,
  getControls,
  preferenceAdjustments,
  PILOT_USER_ID,
  saveCandidate,
} from "../../src/server/store";
import { loadFixtureCandidates } from "../../src/connectors/fixtures";

export default defineTool({
  description:
    "Load clearly labelled FIXTURE candidates (dev only), run the delivery policy, and return the best short opener if any. Never present these as live offers.",
  inputSchema: z.object({
    allowFixtures: z.boolean().default(true),
  }),
  async execute({ allowFixtures }) {
    if (!allowFixtures && process.env.FIXTURE_MODE !== "1") {
      return { selected: null, note: "Fixture mode disabled." };
    }
    await ensurePilotUser();
    const controls = await getControls(PILOT_USER_ID);
    const adjustments = await preferenceAdjustments(PILOT_USER_ID);
    const fixtures = loadFixtureCandidates(PILOT_USER_ID);
    for (const c of fixtures) {
      await saveCandidate(PILOT_USER_ID, {
        id: c.id,
        topic: String(c.topic),
        title: c.title,
        opener: c.opener,
        details: c.details,
        reasonForUser: c.reasonForUser,
        reasonNow: c.reasonNow,
        evidence: c.evidence,
        relevance: c.relevance,
        timing: c.timing,
        novelty: c.novelty,
        effort: c.effort,
        expiresAt: c.expiresAt,
        dedupeKey: c.dedupeKey,
        urgent: c.urgent,
        fixture: true,
      }).catch(() => {
        /* dedupe ok */
      });
    }
    const best = selectBestCandidate(fixtures as Candidate[], {
      controls,
      adjustments,
      now: new Date(),
    });
    if (!best) {
      return { selected: null, note: "No fixture candidate passed the policy gate." };
    }
    return {
      selected: {
        id: best.id,
        topic: best.topic,
        opener: craftOpener(best),
        details: best.details,
        fixture: true,
        label: "FIXTURE — not a live offer",
        evidence: best.evidence,
        score: best.score,
      },
    };
  },
});
