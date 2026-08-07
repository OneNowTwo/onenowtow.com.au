export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/** Service role is required for uploads, webhooks, admin RPCs, and profile repair. */
export function isSupabaseAdminConfigured(): boolean {
  return Boolean(isSupabaseConfigured() && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * Local `.data/uploads.json` is for local MVP only.
 * Never use it on Vercel / production — filesystem is ephemeral.
 */
export function allowLocalDataStore(): boolean {
  if (process.env.VERCEL) return false;
  if (process.env.NODE_ENV === "production") return false;
  return true;
}

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export function assertProductionAppUrl(): void {
  if (!process.env.VERCEL && process.env.NODE_ENV !== "production") return;
  const url = process.env.NEXT_PUBLIC_APP_URL;
  if (!url || url.includes("localhost")) {
    console.warn(
      "[looksee] NEXT_PUBLIC_APP_URL should be your public https URL on Vercel (needed for Mux CORS).",
    );
  }
}
