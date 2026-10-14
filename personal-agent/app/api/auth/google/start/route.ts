import { NextResponse } from "next/server";
import {
  GOOGLE_LOGIN_SCOPES,
  allowedPilotEmail,
  buildGoogleAuthUrl,
  googleConfigured,
  newOAuthState,
} from "@/src/server/google-oauth";

export async function GET(request: Request) {
  if (!googleConfigured()) {
    return NextResponse.json(
      {
        error: "google_not_configured",
        message:
          "GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are missing. Complete the Google OAuth setup first.",
      },
      { status: 503 },
    );
  }
  const url = new URL(request.url);
  const returnTo = url.searchParams.get("returnTo") ?? "/";
  const hint = process.env.PILOT_EMAIL;
  const state = newOAuthState({ purpose: "login", returnTo });
  const authUrl = buildGoogleAuthUrl({
    purpose: "login",
    state,
    scopes: [...GOOGLE_LOGIN_SCOPES],
    loginHint: hint && allowedPilotEmail(hint) ? hint : undefined,
  });
  return NextResponse.redirect(authUrl);
}
