/**
 * Google connection surface for the UI/API.
 * Live sync lives in google-sync.ts; OAuth in server/google-oauth.ts.
 */

import { googleConfigured } from "../server/google-oauth";

export type ConnectionStatus =
  | "disconnected"
  | "needs_auth"
  | "connected"
  | "error"
  | "fixture";

export function googleSetupStatus(): {
  configured: boolean;
  connectPath: string;
  loginPath: string;
} {
  return {
    configured: googleConfigured(),
    connectPath: "/api/connections/google/start?returnTo=/connections",
    loginPath: "/api/auth/google/start?returnTo=/",
  };
}
