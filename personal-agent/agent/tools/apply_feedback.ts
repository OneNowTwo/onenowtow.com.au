import { defineTool } from "eve/tools";
import { z } from "zod";
import { applyFeedbackCommand, ensurePilotUser, PILOT_USER_ID } from "../../src/server/store";

export default defineTool({
  description:
    "Apply conversational feedback or control phrases (less of this, good find, pause, resume, remind me, flat today, leave me alone until…). Persists preferences and pause state. Call this for explicit control phrases before continuing.",
  inputSchema: z.object({
    text: z.string().min(1),
    idempotencyKey: z.string().min(1),
    topicHint: z.string().optional(),
    suggestionId: z.string().optional(),
  }),
  async execute(input) {
    await ensurePilotUser();
    const result = await applyFeedbackCommand({
      userId: PILOT_USER_ID,
      text: input.text,
      idempotencyKey: input.idempotencyKey,
      topicHint: input.topicHint,
      suggestionId: input.suggestionId,
    });
    return {
      kind: result.kind,
      acknowledgement: result.acknowledgement,
      duplicate: result.duplicate,
      paused: result.controls.paused,
      pauseUntil: result.controls.pauseUntil,
      revision: result.controls.revision,
    };
  },
});
