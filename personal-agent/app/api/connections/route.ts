import { NextResponse } from "next/server";
import { getSessionUser } from "@/src/server/auth";
import { calendarAdapter, gmailAdapter } from "@/src/connectors/google";
import { ensurePilotUser, listConnections } from "@/src/server/store";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  await ensurePilotUser();
  const rows = await listConnections(user.userId);
  const live = await Promise.all([gmailAdapter().status(), calendarAdapter().status()]);
  return NextResponse.json({
    connections: rows.map((r) => {
      const adapter = live.find((l) => l && r.provider === (l as { provider?: string }).provider);
      return {
        id: r.id,
        provider: r.provider,
        status: r.status,
        fixture: r.fixture,
        lastSuccessAt: r.lastSuccessAt,
        accountRef: r.accountRef,
        note:
          r.status === "disconnected"
            ? "Not connected — OAuth credentials required for live sync."
            : undefined,
        adapterHint: adapter,
      };
    }),
    setupRequired: [
      "GOOGLE_CLIENT_ID",
      "GOOGLE_CLIENT_SECRET",
      "GOOGLE_REDIRECT_URI",
      "CRM sheet ID / service account or OAuth for selected ONT sheet",
    ],
  });
}
