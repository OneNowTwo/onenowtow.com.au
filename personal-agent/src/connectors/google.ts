/**
 * Google adapter contracts for Milestone 2.
 * Real OAuth credentials are environment-specific and not portable from ChatGPT.
 */

export type ConnectionStatus =
  | "disconnected"
  | "needs_auth"
  | "connected"
  | "error"
  | "fixture";

export interface SourceAdapter {
  provider: string;
  status(): Promise<{
    status: ConnectionStatus;
    accountRef?: string;
    lastSuccessAt?: string;
    fixture: boolean;
  }>;
  connectUrl?(returnTo: string): string;
  disconnect?(): Promise<void>;
}

export function gmailAdapter(): SourceAdapter {
  return {
    provider: "gmail",
    async status() {
      const hasCreds = Boolean(
        process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
      );
      return {
        status: hasCreds ? "needs_auth" : "disconnected",
        fixture: false,
      };
    },
    connectUrl(returnTo: string) {
      // Placeholder — real OAuth registered against this deployment.
      return `/api/connections/google/start?provider=gmail&returnTo=${encodeURIComponent(returnTo)}`;
    },
  };
}

export function calendarAdapter(): SourceAdapter {
  return {
    provider: "google_calendar",
    async status() {
      const hasCreds = Boolean(
        process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
      );
      return {
        status: hasCreds ? "needs_auth" : "disconnected",
        fixture: false,
      };
    },
    connectUrl(returnTo: string) {
      return `/api/connections/google/start?provider=google_calendar&returnTo=${encodeURIComponent(returnTo)}`;
    },
  };
}
