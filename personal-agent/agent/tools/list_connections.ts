import { defineTool } from "eve/tools";
import { z } from "zod";
import { ensurePilotUser, listConnections, PILOT_USER_ID } from "../../src/server/store";

export default defineTool({
  description:
    "List connection status for Gmail, Calendar, CRM and other sources. Never invent a Connected state for fixtures.",
  inputSchema: z.object({}),
  async execute() {
    await ensurePilotUser();
    const rows = await listConnections(PILOT_USER_ID);
    return rows.map((r) => ({
      provider: r.provider,
      status: r.status,
      fixture: r.fixture,
      lastSuccessAt: r.lastSuccessAt,
      accountRef: r.accountRef,
    }));
  },
});
