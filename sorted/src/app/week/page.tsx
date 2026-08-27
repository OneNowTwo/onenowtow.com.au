"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/Button";
import { track } from "@/lib/analytics";
import { STORAGE_KEYS } from "@/lib/constants";
import { defaultWeek, readWeek, subscribeKey, writeWeek } from "@/lib/storage";

export default function WeekPage() {
  const days = useSyncExternalStore(
    (onStoreChange) => subscribeKey(STORAGE_KEYS.week, onStoreChange),
    () => readWeek() ?? defaultWeek(),
    defaultWeek,
  );
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    track("weekly_plan_viewed");
  }, []);

  async function joinWaitlist() {
    setError(null);
    if (!email.includes("@")) {
      setError("Add an email so we can let you know.");
      return;
    }
    const response = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, feature: "sorted-3" }),
    });
    if (!response.ok) {
      setError("Could not join just now. Try again.");
      return;
    }
    track("sorted_3_waitlist_joined", { feature: "sorted-3" });
    setJoined(true);
    writeWeek(days);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">My week</p>
      <h1 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">Dinner this week</h1>
      <ol className="mt-10 divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card">
        {days.map((day) => (
          <li key={day.day} className="flex items-center justify-between gap-4 px-5 py-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-muted">{day.day}</p>
              <p className="mt-1 font-medium">{day.title}</p>
            </div>
            <div className="text-right text-sm text-muted">
              {day.price ? <p>${day.price}</p> : null}
              {day.status === "sorted" ? <p className="text-sage">Sorted ✓</p> : null}
              {day.status === "home" ? <p>Home</p> : null}
              {day.status === "unplanned" ? <p>Not planned</p> : null}
            </div>
          </li>
        ))}
      </ol>

      <ButtonLink href="/sort" size="lg" className="mt-8">
        Sort this week
      </ButtonLink>

      <section className="mt-16 rounded-3xl bg-foreground px-6 py-10 text-background">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-background/60">
          Sorted 3
        </p>
        <h2 className="mt-3 font-display text-3xl tracking-tight">
          Let us organise three dinners each week.
        </h2>
        <p className="mt-3 max-w-md text-background/70 leading-relaxed">
          You stay in control and can swap anything before ordering.
        </p>
        {joined ? (
          <p className="mt-6 text-sm">You&apos;re on the list. We&apos;ll be in touch.</p>
        ) : (
          <form
            className="mt-6 flex flex-col gap-3 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              void joinWaitlist();
            }}
          >
            <label className="sr-only" htmlFor="waitlist-email">
              Email
            </label>
            <input
              id="waitlist-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="h-12 flex-1 rounded-full border border-background/20 bg-background/10 px-5 text-background placeholder:text-background/50"
            />
            <Button type="submit" variant="secondary">
              Join waitlist
            </Button>
          </form>
        )}
        {error ? <p className="mt-3 text-sm text-accent-soft">{error}</p> : null}
      </section>
    </div>
  );
}
