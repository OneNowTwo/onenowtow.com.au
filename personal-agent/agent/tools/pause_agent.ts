import { defineTool } from "eve/tools";
import { z } from "zod";
import { ensurePilotUser, pauseUser, PILOT_USER_ID } from "../../src/server/store";

export default defineTool({
  description:
    "Pause all agent-initiated activity immediately. Optional ISO resume time. User chat still works while paused.",
  inputSchema: z.object({
    until: z.string().datetime().nullable().optional(),
  }),
  async execute(input) {
    await ensurePilotUser();
    const controls = await pauseUser(PILOT_USER_ID, input.until ?? null);
    return {
      paused: controls.paused,
      pauseUntil: controls.pauseUntil,
      revision: controls.revision,
      acknowledgement: controls.pauseUntil
        ? `Done. Quiet until ${controls.pauseUntil}.`
        : "Paused. I'll wait until you tell me otherwise.",
    };
  },
});
