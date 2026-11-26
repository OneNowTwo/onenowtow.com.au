import { defineTool } from "eve/tools";
import { z } from "zod";
import { ensurePilotUser, PILOT_USER_ID, upsertFact } from "../../src/server/store";

export default defineTool({
  description:
    "Save an explicit fact Michael confirmed (interest, area, budget preference, project, routine).",
  inputSchema: z.object({
    entity: z.string().min(1),
    attribute: z.string().min(1),
    value: z.string().min(1),
    confidence: z.number().min(0).max(100).optional(),
  }),
  async execute(input) {
    await ensurePilotUser();
    const id = await upsertFact(PILOT_USER_ID, {
      entity: input.entity,
      attribute: input.attribute,
      value: input.value,
      confidence: input.confidence,
      explicit: true,
      sourceRefs: ["conversation"],
    });
    return { id, saved: true };
  },
});
