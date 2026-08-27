"use client";

import { useEffect, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { useHousehold } from "@/components/providers/HouseholdProvider";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/client";
import { formatPeople } from "@/lib/format";
import { BUDGET_OPTIONS } from "@/lib/constants";

export default function ProfilePage() {
  const { household, ready } = useHousehold();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const supabaseReady = isSupabaseConfigured();

  useEffect(() => {
    if (!supabaseReady) return;
    const supabase = createClient();
    void supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });
  }, [supabaseReady]);

  async function sendMagicLink() {
    if (!supabaseReady) return;
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setMessage(error ? error.message : "Check your email for a sign-in link.");
  }

  async function signOut() {
    if (!supabaseReady) return;
    const supabase = createClient();
    await supabase.auth.signOut();
    setUserEmail(null);
  }

  const budgetLabel =
    BUDGET_OPTIONS.find((option) => option.id === household?.typical_budget)?.label ??
    household?.typical_budget;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Profile</p>
      <h1 className="mt-3 font-display text-4xl tracking-tight">Your household</h1>

      {!ready ? (
        <p className="mt-8 text-muted">Loading…</p>
      ) : household ? (
        <section className="mt-8 rounded-3xl border border-border bg-card p-6">
          <h2 className="font-display text-2xl">{household.household_name}</h2>
          <p className="mt-2 text-muted">
            {household.postcode} · {formatPeople(household.adults, household.children)}
          </p>
          <p className="mt-3 text-sm text-ink-soft">Typical budget: {budgetLabel}</p>
          {household.favourite_cuisines.length > 0 ? (
            <p className="mt-2 text-sm text-ink-soft">
              Cuisines: {household.favourite_cuisines.join(", ")}
            </p>
          ) : null}
          <ButtonLink href="/household?next=/profile" className="mt-6" variant="secondary">
            Edit household
          </ButtonLink>
        </section>
      ) : (
        <section className="mt-8">
          <p className="text-muted">No household saved on this device yet.</p>
          <ButtonLink href="/household" className="mt-6">
            Create household
          </ButtonLink>
        </section>
      )}

      <section className="mt-12">
        <h2 className="font-display text-2xl tracking-tight">Save this household</h2>
        {supabaseReady ? (
          userEmail ? (
            <div className="mt-4">
              <p className="text-ink-soft">Signed in as {userEmail}</p>
              <Button className="mt-4" variant="secondary" onClick={() => void signOut()}>
                Sign out
              </Button>
            </div>
          ) : (
            <form
              className="mt-4 flex flex-col gap-3 sm:flex-row"
              onSubmit={(event) => {
                event.preventDefault();
                void sendMagicLink();
              }}
            >
              <label className="sr-only" htmlFor="profile-email">
                Email
              </label>
              <input
                id="profile-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="h-12 flex-1 rounded-full border border-border bg-card px-5"
              />
              <Button type="submit">Email me a link</Button>
            </form>
          )
        ) : (
          <p className="mt-3 max-w-md text-muted leading-relaxed">
            You&apos;re in guest mode. Household and favourites stay in this browser until
            Supabase auth is configured.
          </p>
        )}
        {message ? <p className="mt-3 text-sm text-sage">{message}</p> : null}
      </section>
    </div>
  );
}
