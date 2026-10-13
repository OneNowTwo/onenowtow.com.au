import { cookies } from "next/headers";
import {
  decodeSession,
  encodeSession,
  SESSION_COOKIE,
  type SessionUser,
} from "./auth-core";
import { ensurePilotUser, PILOT_USER_ID } from "./store";

export type { SessionUser };
export {
  decodeSession,
  encodeSession,
  SESSION_COOKIE,
  sessionFromRequest,
} from "./auth-core";

export async function getSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  return decodeSession(jar.get(SESSION_COOKIE)?.value);
}

export async function requireSessionUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    throw new Response(JSON.stringify({ error: "authentication_required" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }
  return user;
}

export async function loginPilot(email: string): Promise<SessionUser> {
  const pilot = await ensurePilotUser();
  const allowed = (process.env.PILOT_EMAIL ?? pilot.email).toLowerCase();
  if (email.trim().toLowerCase() !== allowed) {
    throw new Error("This pilot only admits the configured account.");
  }
  const user: SessionUser = {
    userId: PILOT_USER_ID,
    email: allowed,
    displayName: process.env.PILOT_DISPLAY_NAME ?? "Michael",
  };
  const jar = await cookies();
  jar.set(SESSION_COOKIE, encodeSession(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return user;
}

export async function logout(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}
