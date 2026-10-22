import { google } from "googleapis";
import { createHash, randomBytes } from "node:crypto";
import { encryptSecret, decryptSecret } from "./crypto";

export const GOOGLE_LOGIN_SCOPES = [
  "openid",
  "email",
  "profile",
] as const;

export const GOOGLE_DATA_SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/spreadsheets.readonly",
] as const;

export type GoogleOAuthPurpose = "login" | "connections";

function appUrl(): string {
  return (
    process.env.APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  );
}

export function googleConfigured(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

export function createOAuthClient(redirectPath: string) {
  if (!googleConfigured()) {
    throw new Error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are not configured");
  }
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${appUrl()}${redirectPath}`,
  );
}

export function buildGoogleAuthUrl(opts: {
  purpose: GoogleOAuthPurpose;
  state: string;
  scopes: string[];
  loginHint?: string;
}): string {
  const redirectPath =
    opts.purpose === "login"
      ? "/api/auth/google/callback"
      : "/api/connections/google/callback";
  const client = createOAuthClient(redirectPath);
  return client.generateAuthUrl({
    access_type: "offline",
    prompt: opts.purpose === "connections" ? "consent" : "select_account",
    include_granted_scopes: true,
    scope: opts.scopes,
    state: opts.state,
    login_hint: opts.loginHint,
  });
}

export async function exchangeCode(opts: {
  purpose: GoogleOAuthPurpose;
  code: string;
}) {
  const redirectPath =
    opts.purpose === "login"
      ? "/api/auth/google/callback"
      : "/api/connections/google/callback";
  const client = createOAuthClient(redirectPath);
  const { tokens } = await client.getToken(opts.code);
  client.setCredentials(tokens);
  return { client, tokens };
}

export async function fetchGoogleProfile(accessToken: string) {
  const client = createOAuthClient("/api/auth/google/callback");
  client.setCredentials({ access_token: accessToken });
  const oauth2 = google.oauth2({ version: "v2", auth: client });
  const { data } = await oauth2.userinfo.get();
  return {
    email: (data.email ?? "").toLowerCase(),
    name: data.name ?? data.email ?? "User",
    picture: data.picture ?? undefined,
    googleSub: data.id ?? undefined,
  };
}

export function packTokenBlob(tokens: {
  access_token?: string | null;
  refresh_token?: string | null;
  expiry_date?: number | null;
  scope?: string | null;
  token_type?: string | null;
}): string {
  return encryptSecret(
    JSON.stringify({
      access_token: tokens.access_token ?? null,
      refresh_token: tokens.refresh_token ?? null,
      expiry_date: tokens.expiry_date ?? null,
      scope: tokens.scope ?? null,
      token_type: tokens.token_type ?? null,
    }),
  );
}

export function unpackTokenBlob(blob: string): {
  access_token: string | null;
  refresh_token: string | null;
  expiry_date: number | null;
  scope: string | null;
  token_type: string | null;
} {
  return JSON.parse(decryptSecret(blob)) as {
    access_token: string | null;
    refresh_token: string | null;
    expiry_date: number | null;
    scope: string | null;
    token_type: string | null;
  };
}

export async function getAuthedGoogleClient(encryptedBlob: string) {
  const tokens = unpackTokenBlob(encryptedBlob);
  const client = createOAuthClient("/api/connections/google/callback");
  client.setCredentials({
    access_token: tokens.access_token ?? undefined,
    refresh_token: tokens.refresh_token ?? undefined,
    expiry_date: tokens.expiry_date ?? undefined,
    scope: tokens.scope ?? undefined,
    token_type: tokens.token_type ?? undefined,
  });
  client.on("tokens", () => {
    /* caller should persist refreshed tokens via refreshConnectionTokens */
  });
  // Force refresh if expired
  if (tokens.expiry_date && tokens.expiry_date < Date.now() + 60_000) {
    const { credentials } = await client.refreshAccessToken();
    client.setCredentials(credentials);
    return {
      client,
      refreshedBlob: packTokenBlob({
        access_token: credentials.access_token,
        refresh_token: credentials.refresh_token ?? tokens.refresh_token,
        expiry_date: credentials.expiry_date,
        scope: credentials.scope ?? tokens.scope,
        token_type: credentials.token_type ?? tokens.token_type,
      }),
    };
  }
  return { client, refreshedBlob: null as string | null };
}

export function newOAuthState(payload: Record<string, string>): string {
  const nonce = randomBytes(16).toString("base64url");
  const body = Buffer.from(JSON.stringify({ ...payload, nonce }), "utf8").toString(
    "base64url",
  );
  const sig = createHash("sha256")
    .update(`${body}.${process.env.SESSION_SECRET ?? "dev"}`)
    .digest("base64url");
  return `${body}.${sig}`;
}

export function parseOAuthState(state: string): Record<string, string> | null {
  const [body, sig] = state.split(".");
  if (!body || !sig) return null;
  const expected = createHash("sha256")
    .update(`${body}.${process.env.SESSION_SECRET ?? "dev"}`)
    .digest("base64url");
  if (sig !== expected) return null;
  try {
    return JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as Record<
      string,
      string
    >;
  } catch {
    return null;
  }
}

export function allowedPilotEmail(email: string): boolean {
  const allowed = (process.env.PILOT_EMAIL ?? "michael@onenowtwo.com.au").toLowerCase();
  return email.trim().toLowerCase() === allowed;
}
