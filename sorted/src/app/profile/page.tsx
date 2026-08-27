"use client";

import { useEffect, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { useHousehold } from "@/components/providers/HouseholdProvider";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/client";
import { formatBudgetLabel, formatPeople, formatPeopleTotal } from "@/lib/format";
import { suburbForPostcode } from "@/lib/postcodes";

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

  const suburb = household ? suburbForPostcode(household.postcode) : undefined;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">You</p>
      <h1 className="mt-3 font-display text-4xl tracking-tight">Your household</h1>

      {!ready ? (
        <p className="mt-8 text-muted">Loading…</p>
      ) : household ? (
        <section className="mt-8 rounded-3xl border border-border bg-card p-6 sm:p-8">
          <h2 className="font-display text-3xl tracking-tight">{household.household_name}</h2>
          <p className="mt-3 text-lg text-ink-soft">
            {formatPeopleTotal(household.adults, household.children)}
            {suburb ? ` · ${suburb}` : null}
          </p>
          <p className="mt-1 text-muted">{formatPeople(household.adults, household.children)}</p>
          <dl className="mt-6 space-y-3 text-sm">
            <div>
              <dt className="text-muted">Usual spend</dt>
              <dd className="mt-0.5 font-medium">{formatBudgetLabel(household.typical_budget)}</dd>
            </div>
            {household.favourite_cuisines.length > 0 ? (
              <div>
                <dt className="text-muted">You like</dt>
                <dd className="mt-0.5 font-medium">{household.favourite_cuisines.join(", ")}</dd>
              </div>
            ) : null}
            {household.dietary_requirements.filter((item) => item !== "none").length > 0 ? (
              <div>
                <dt className="text-muted">Food rules</dt>
                <dd className="mt-0.5 font-medium capitalize">
                  {household.dietary_requirements
                    .filter((item) => item !== "none")
                    .join(", ")
                    .replaceAll("-", " ")}
                </dd>
              </div>
            ) : null}
            {household.avoided_foods ? (
              <div>
                <dt className="text-muted">You avoid</dt>
                <dd className="mt-0.5 font-medium">{household.avoided_foods}</dd>
              </div>
            ) : null}
          </dl>
          <ButtonLink href="/household?next=/profile" className="mt-8" variant="secondary">
            Update household
          </ButtonLink>
        </section>
      ) : (
        <section className="mt-8">
          <p className="max-w-md text-muted leading-relaxed">
            Tell us who you&apos;re feeding and we&apos;ll stop asking every night.
          </p>
          <ButtonLink href="/household" className="mt-6">
            Set up household
          </ButtonLink>
        </section>
      )}

      <section className="mt-12">
        <h2 className="font-display text-2xl tracking-tight">Keep this household</h2>
        <p className="mt-2 max-w-md text-sm text-muted leading-relaxed">
          Optional. Useful if you switch phones. Dinner still works without it.
        </p>
        {supabaseReady ? (
          userEmail ? (
            <div className="mt-4">
              <p className="text-ink-soft">{userEmail}</p>
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
          <p className="mt-3 max-w-md text-sm text-muted leading-relaxed">
            Saved on this device for now.
          </p>
        )}
        {message ? <p className="mt-3 text-sm text-sage">{message}</p> : null}
      </section>
    </div>
  );
}
