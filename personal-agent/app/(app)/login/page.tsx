"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";

function LoginInner() {
  const params = useSearchParams();
  const error = params.get("error");
  const [devBusy, setDevBusy] = useState(false);
  const [devError, setDevError] = useState<string>();
  const allowDev =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

  async function devLogin() {
    setDevBusy(true);
    setDevError(undefined);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "michael@onenowtwo.com.au" }),
    });
    setDevBusy(false);
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
      setDevError(data.message ?? data.error ?? "Dev login unavailable");
      return;
    }
    window.location.href = "/";
  }

  const errorText =
    error === "not_pilot"
      ? "This pilot only admits the configured Google account."
      : error === "google_not_configured"
        ? "Google Sign-In is not configured yet."
        : error
          ? `Sign-in issue: ${error}`
          : null;

  return (
    <div className="pa-panel pa-login">
      <h1>Sign in</h1>
      <p>
        I&apos;ll get to know your work and what you like doing outside it, then bring you things
        worth your time. Sign in with Google — no password stored here.
      </p>
      {errorText ? <p className="pa-error">{errorText}</p> : null}
      <div className="pa-actions">
        <Button asChild>
          <a href="/api/auth/google/start?returnTo=/">Continue with Google</a>
        </Button>
      </div>
      <p className="pa-meta" style={{ marginTop: "1rem" }}>
        After sign-in, connect Gmail, Calendar and your ONT CRM sheet from Connections.
      </p>
      {allowDev ? (
        <div className="pa-section">
          <h2>Local fallback</h2>
          <p className="pa-muted">
            Only on localhost, and only when Google OAuth is not configured (or ALLOW_DEV_EMAIL_LOGIN=1).
          </p>
          {devError ? <p className="pa-error">{devError}</p> : null}
          <Button type="button" variant="ghost" disabled={devBusy} onClick={() => void devLogin()}>
            {devBusy ? "Signing in…" : "Dev email login"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="pa-panel">Loading…</div>}>
      <LoginInner />
    </Suspense>
  );
}
