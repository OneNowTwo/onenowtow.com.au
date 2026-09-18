"use client";

import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const supabaseReady = isSupabaseConfigured();

  async function send() {
    if (!supabaseReady) return;
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setMessage(error ? error.message : "Check your email for a sign-in link.");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-4xl tracking-tight">Sign in</h1>
      <p className="mt-3 text-muted leading-relaxed">
        Email a magic link, or keep going as a guest.
      </p>
      {supabaseReady ? (
        <form
          className="mt-8 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            void send();
          }}
        >
          <label className="block text-sm font-semibold">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 h-12 w-full rounded-full border border-border bg-card px-5"
            />
          </label>
          <Button type="submit" size="lg" className="w-full">
            Email me a link
          </Button>
        </form>
      ) : (
        <p className="mt-6 text-muted">Auth isn&apos;t configured in this environment.</p>
      )}
      {message ? <p className="mt-4 text-sm">{message}</p> : null}
      <ButtonLink href="/household?next=/sort" variant="secondary" className="mt-8 w-full">
        Continue as guest
      </ButtonLink>
    </div>
  );
}
