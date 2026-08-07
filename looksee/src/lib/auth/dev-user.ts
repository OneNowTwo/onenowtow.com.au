/**
 * Temporary development identity until Supabase Auth lands (Phase 4).
 * Replace getCurrentUserId() with real session auth — do not spread this elsewhere.
 */
import { seedProfiles } from "@/lib/seed/data";

export const DEV_USER_ID = "u1000001-0000-4000-8000-000000000001";

export function getDevUser() {
  const profile = seedProfiles.find((p) => p.id === DEV_USER_ID);
  if (!profile) {
    throw new Error("Dev user missing from seed profiles");
  }
  return profile;
}

/** Phase 4: swap this for Supabase Auth session user id. */
export function getCurrentUserId(): string {
  return DEV_USER_ID;
}

export function isDevModerationEnabled(): boolean {
  return (
    process.env.NODE_ENV === "development" ||
    process.env.ALLOW_DEV_MODERATION === "true"
  );
}
