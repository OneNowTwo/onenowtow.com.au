import { NextResponse } from "next/server";
import {
  allowedPilotEmail,
  exchangeCode,
  fetchGoogleProfile,
  packTokenBlob,
  parseOAuthState,
} from "@/src/server/google-oauth";
import { markGoogleConnected } from "@/src/server/store";
import { syncAllGoogle } from "@/src/connectors/google-sync";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const err = url.searchParams.get("error");
  if (err) {
    return NextResponse.redirect(
      new URL(`/connections?error=${encodeURIComponent(err)}`, url.origin),
    );
  }
  if (!code || !state) {
    return NextResponse.redirect(new URL("/connections?error=missing_code", url.origin));
  }
  const parsed = parseOAuthState(state);
  if (!parsed || parsed.purpose !== "connections") {
    return NextResponse.redirect(new URL("/connections?error=invalid_state", url.origin));
  }

  try {
    const { tokens } = await exchangeCode({ purpose: "connections", code });
    if (!tokens.access_token) {
      return NextResponse.redirect(new URL("/connections?error=no_token", url.origin));
    }
    const profile = await fetchGoogleProfile(tokens.access_token);
    if (!profile.email || !allowedPilotEmail(profile.email)) {
      return NextResponse.redirect(new URL("/connections?error=not_pilot", url.origin));
    }
    const scopes = (tokens.scope ?? "").split(" ").filter(Boolean);
    await markGoogleConnected({
      userId: parsed.userId,
      accountRef: profile.email,
      scopes,
      credentialBlob: packTokenBlob(tokens),
    });
    // Kick off first sync — don't block redirect too long; await for pilot reliability
    await syncAllGoogle(parsed.userId).catch(() => null);
    const returnTo = parsed.returnTo?.startsWith("/") ? parsed.returnTo : "/connections";
    return NextResponse.redirect(
      new URL(`${returnTo}?connected=1`, url.origin),
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "connect_failed";
    return NextResponse.redirect(
      new URL(`/connections?error=${encodeURIComponent(message)}`, url.origin),
    );
  }
}
