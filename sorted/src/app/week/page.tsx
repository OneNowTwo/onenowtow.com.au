"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { useCatalog } from "@/components/providers/useCatalog";
import { track } from "@/lib/analytics";
import { STORAGE_KEYS } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { defaultWeek, readWeek, subscribeKey, writeWeek } from "@/lib/storage";

export default function WeekPage() {
  const days = useSyncExternalStore(
    (onStoreChange) => subscribeKey(STORAGE_KEYS.week, onStoreChange),
    () => readWeek() ?? defaultWeek(),
    defaultWeek,
  );
  const catalog = useCatalog();
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

  function restaurantName(day: (typeof days)[number]): string | undefined {
    if (day.restaurant) return day.restaurant;
    if (!day.bundleId || !catalog) return undefined;
    const bundle = catalog.bundles.find((item) => item.id === day.bundleId);
    return catalog.restaurants.find((item) => item.id === bundle?.restaurant_id)?.name;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">My week</p>
      <h1 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">Dinner this week</h1>
      <ol className="mt-10 grid gap-3">
        {days.map((day) => {
          const restaurant = restaurantName(day);
          return (
            <li
              key={day.day}
              className={cn(
                "rounded-3xl px-5 py-4",
                day.status === "sorted" && "border border-border bg-card",
                day.status === "home" && "border border-dashed border-border bg-muted-bg/50",
                day.status === "unplanned" && "border border-transparent bg-muted-bg/70",
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold tracking-[0.16em] text-muted">{day.day}</p>
                  {day.status === "unplanned" ? (
                    <p className="mt-1 text-muted">Not planned</p>
                  ) : (
                    <>
                      <p className="mt-1 font-display text-xl tracking-tight">{day.title}</p>
                      {restaurant ? <p className="mt-0.5 text-sm text-ink-soft">{restaurant}</p> : null}
                    </>
                  )}
                </div>
                <div className="text-right text-sm">
                  {day.status === "sorted" && day.price != null ? (
                    <p className="font-medium">{formatPrice(day.price)}</p>
                  ) : null}
                  {day.status === "sorted" ? (
                    <p className="mt-1 font-semibold text-sage">Sorted ✓</p>
                  ) : null}
                  {day.status === "home" ? <p className="mt-6 text-muted">Home</p> : null}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <ButtonLink href="/sort" size="lg" className="mt-8">
        Sort this week
      </ButtonLink>

      <section className="mt-16 rounded-3xl bg-foreground px-6 py-10 text-background">
        <h2 className="font-display text-3xl tracking-tight">Want us to sort this every week?</h2>
        <p className="mt-3 max-w-md text-lg text-background/75 leading-relaxed">
          Three dinners. Different restaurants. One approval.
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
              Join Sorted 3
            </Button>
          </form>
        )}
        {error ? <p className="mt-3 text-sm text-accent-soft">{error}</p> : null}
      </section>
    </div>
  );
}
