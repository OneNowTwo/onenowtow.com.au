import { NextResponse } from "next/server";
import {
  allowedPilotEmail,
  exchangeCode,
  fetchGoogleProfile,
  parseOAuthState,
} from "@/src/server/google-oauth";
import { encodeSession, SESSION_COOKIE } from "@/src/server/auth-core";
import { ensurePilotUser, PILOT_USER_ID, updatePilotProfile } from "@/src/server/store";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const err = url.searchParams.get("error");
  if (err) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(err)}`, url.origin));
  }
  if (!code || !state) {
    return NextResponse.redirect(new URL("/login?error=missing_code", url.origin));
  }
  const parsed = parseOAuthState(state);
  if (!parsed || parsed.purpose !== "login") {
    return NextResponse.redirect(new URL("/login?error=invalid_state", url.origin));
  }

  try {
    const { tokens } = await exchangeCode({ purpose: "login", code });
    if (!tokens.access_token) {
      return NextResponse.redirect(new URL("/login?error=no_token", url.origin));
    }
    const profile = await fetchGoogleProfile(tokens.access_token);
    if (!profile.email || !allowedPilotEmail(profile.email)) {
      return NextResponse.redirect(
        new URL("/login?error=not_pilot", url.origin),
      );
    }
    await ensurePilotUser();
    await updatePilotProfile(profile.name, profile.email);
    const session = encodeSession({
      userId: PILOT_USER_ID,
      email: profile.email,
      displayName: profile.name,
    });
    const returnTo = parsed.returnTo?.startsWith("/") ? parsed.returnTo : "/";
    const res = NextResponse.redirect(new URL(returnTo, url.origin));
    res.cookies.set(SESSION_COOKIE, session, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  } catch (e) {
    const message = e instanceof Error ? e.message : "auth_failed";
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(message)}`, url.origin),
    );
  }
}
