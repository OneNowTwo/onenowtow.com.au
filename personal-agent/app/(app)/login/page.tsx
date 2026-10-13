"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("michael@onenowtwo.com.au");
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(undefined);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setBusy(false);
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? "Login failed");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="pa-panel pa-login">
      <h1>Sign in</h1>
      <p>
        Pilot access for Michael. I&apos;ll get to know your work and what you like doing outside
        it, then bring you things worth your time.
      </p>
      <form onSubmit={onSubmit} className="pa-form">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          required
        />
        {error ? <p className="pa-error">{error}</p> : null}
        <Button type="submit" disabled={busy}>
          {busy ? "Signing in…" : "Continue"}
        </Button>
      </form>
    </div>
  );
}
