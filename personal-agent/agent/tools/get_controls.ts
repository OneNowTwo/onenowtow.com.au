import { defineTool } from "eve/tools";
import { z } from "zod";
import { ensurePilotUser, getControls, PILOT_USER_ID } from "../../src/server/store";

export default defineTool({
  description: "Read current pause state, quiet hours, frequency and channel preferences.",
  inputSchema: z.object({}),
  async execute() {
    await ensurePilotUser();
    return getControls(PILOT_USER_ID);
  },
});
