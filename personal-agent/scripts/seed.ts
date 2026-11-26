import { ensurePilotUser, saveCandidate } from "../src/server/store";
import { loadFixtureCandidates } from "../src/connectors/fixtures";
import { PILOT_USER_ID } from "../src/server/store";

async function main() {
  await ensurePilotUser();
  for (const c of loadFixtureCandidates(PILOT_USER_ID)) {
    try {
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
      });
      console.log("seeded fixture", c.id);
    } catch {
      console.log("skip existing", c.id);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
