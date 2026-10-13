import { defineTool } from "eve/tools";
import { z } from "zod";
import {
  ensurePilotUser,
  listFacts,
  listPreferences,
  PILOT_USER_ID,
} from "../../src/server/store";

export default defineTool({
  description: "List editable memory facts and preference adjustments for Michael.",
  inputSchema: z.object({}),
  async execute() {
    await ensurePilotUser();
    const [facts, prefs] = await Promise.all([
      listFacts(PILOT_USER_ID),
      listPreferences(PILOT_USER_ID),
    ]);
    return {
      facts: facts.map((f) => ({
        id: f.id,
        entity: f.entity,
        attribute: f.attribute,
        value: f.value,
        confidence: f.confidence,
        explicit: f.explicit,
        sourceRefs: f.sourceRefs,
      })),
      preferences: prefs.map((p) => ({
        id: p.id,
        topic: p.topic,
        polarity: p.polarity,
        weight: p.weight,
        expiresAt: p.expiresAt,
        provenance: p.provenance,
      })),
    };
  },
});
