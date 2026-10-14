import { NextResponse } from "next/server";
import { loginPilot } from "@/src/server/auth";
import { googleConfigured } from "@/src/server/google-oauth";

/**
 * Email login is local/dev fallback only when Google OAuth is not configured
 * and ALLOW_DEV_EMAIL_LOGIN=1. Production pilot uses Google Sign-In.
 */
export async function POST(request: Request) {
  if (googleConfigured() && process.env.ALLOW_DEV_EMAIL_LOGIN !== "1") {
    return NextResponse.json(
      {
        error: "use_google_sign_in",
        message: "Sign in with Google — email login is disabled when OAuth is configured.",
      },
      { status: 403 },
    );
  }
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_DEV_EMAIL_LOGIN !== "1") {
    return NextResponse.json({ error: "use_google_sign_in" }, { status: 403 });
  }
  const body = (await request.json().catch(() => ({}))) as { email?: string };
  if (!body.email) {
    return NextResponse.json({ error: "email_required" }, { status: 400 });
  }
  try {
    const user = await loginPilot(body.email);
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "login_failed" },
      { status: 403 },
    );
  }
}
