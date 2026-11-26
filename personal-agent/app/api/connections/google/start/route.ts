import { NextResponse } from "next/server";
import { getSessionUser } from "@/src/server/auth";
import {
  GOOGLE_DATA_SCOPES,
  GOOGLE_LOGIN_SCOPES,
  buildGoogleAuthUrl,
  googleConfigured,
  newOAuthState,
} from "@/src/server/google-oauth";

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.redirect(new URL("/login?returnTo=/connections", request.url));
  }
  if (!googleConfigured()) {
    return NextResponse.json(
      { error: "google_not_configured" },
      { status: 503 },
    );
  }
  const url = new URL(request.url);
  const returnTo = url.searchParams.get("returnTo") ?? "/connections";
  const state = newOAuthState({
    purpose: "connections",
    returnTo,
    userId: user.userId,
  });
  const authUrl = buildGoogleAuthUrl({
    purpose: "connections",
    state,
    scopes: [...GOOGLE_LOGIN_SCOPES, ...GOOGLE_DATA_SCOPES],
    loginHint: user.email,
  });
  return NextResponse.redirect(authUrl);
}
