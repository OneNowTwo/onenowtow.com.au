import { NextResponse } from "next/server";
import { getSessionUser } from "@/src/server/auth";
import { googleConfigured } from "@/src/server/google-oauth";
import { ensurePilotUser, listConnections } from "@/src/server/store";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  await ensurePilotUser();
  const rows = await listConnections(user.userId);
  const setupRequired: string[] = [];
  if (!googleConfigured()) {
    setupRequired.push("GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET (Google Cloud OAuth Web client)");
  }
  if (!process.env.ONT_CRM_SHEET_ID && !process.env.ONT_CRM_SHEET_URL) {
    setupRequired.push("ONT_CRM_SHEET_ID or full Google Sheet URL");
  }
  if (!process.env.AI_GATEWAY_API_KEY && !process.env.VERCEL) {
    setupRequired.push("AI_GATEWAY_API_KEY or Vercel AI Gateway link for live chat");
  }

  return NextResponse.json({
    connections: rows.map((r) => ({
      id: r.id,
      provider: r.provider,
      status: r.status,
      fixture: r.fixture,
      lastSuccessAt: r.lastSuccessAt,
      accountRef: r.accountRef,
      errorMessage: r.errorMessage,
      note:
        r.status === "disconnected"
          ? googleConfigured()
            ? "Not connected — use Connect Google above."
            : "Waiting on Google OAuth credentials."
          : undefined,
    })),
    googleConfigured: googleConfigured(),
    setupRequired,
  });
}
