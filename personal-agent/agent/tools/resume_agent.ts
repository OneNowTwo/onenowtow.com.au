import { defineTool } from "eve/tools";
import { z } from "zod";
import { ensurePilotUser, PILOT_USER_ID, resumeUser } from "../../src/server/store";

export default defineTool({
  description:
    "Resume proactive behaviour after a pause. Does not dump a backlog of missed suggestions.",
  inputSchema: z.object({}),
  async execute() {
    await ensurePilotUser();
    const controls = await resumeUser(PILOT_USER_ID);
    return {
      paused: controls.paused,
      revision: controls.revision,
      acknowledgement: "Back on. I'll keep it relevant.",
    };
  },
});
