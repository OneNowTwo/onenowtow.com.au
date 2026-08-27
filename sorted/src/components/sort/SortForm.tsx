"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { useHousehold } from "@/components/providers/HouseholdProvider";
import { track } from "@/lib/analytics";
import { MOODS, TONIGHT_BUDGET_OPTIONS } from "@/lib/constants";
import { formatPeople } from "@/lib/format";
import { suburbForPostcode } from "@/lib/postcodes";
import { writeSession } from "@/lib/storage";
import type { RecommendationSessionPayload } from "@/lib/types";

export function SortForm() {
  const router = useRouter();
  const { household, ready } = useHousehold();
  const [adultsOverride, setAdults] = useState<number | null>(null);
  const [childrenOverride, setChildren] = useState<number | null>(null);
  const [editingWho, setEditingWho] = useState(false);
  const [moods, setMoods] = useState<string[]>(["quick", "healthy"]);
  const [budgetOverride, setBudgetId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const adults = adultsOverride ?? household?.adults ?? 2;
  const children = childrenOverride ?? household?.children ?? 2;
  const budgetId =
    budgetOverride ??
    (household?.typical_budget && household.typical_budget !== "100-plus"
      ? household.typical_budget
      : "60-80");

  useEffect(() => {
    if (!ready) return;
    if (!household) router.replace("/household?next=/sort");
  }, [household, ready, router]);

  const budget = useMemo(
    () => TONIGHT_BUDGET_OPTIONS.find((option) => option.id === budgetId) ?? TONIGHT_BUDGET_OPTIONS[2],
    [budgetId],
  );

  function toggleMood(id: string) {
    setMoods((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 2) return [current[1], id];
      return [...current, id];
    });
  }

  async function submit() {
    if (!household) return;
    setLoading(true);
    setError(null);
    track("sort_started", { moods, budgetId, adults, children });
    const input = {
      postcode: household.postcode,
      suburb: suburbForPostcode(household.postcode),
      adults,
      children,
      dietaryRequirements: household.dietary_requirements,
      favouriteCuisines: household.favourite_cuisines,
      avoidedFoods: household.avoided_foods,
      moodTags: moods,
      budgetMin: budget.min,
      budgetMax: budget.max,
      notes,
      householdId: household.id,
    };

    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!response.ok) throw new Error("Could not sort dinner");
      const session = (await response.json()) as RecommendationSessionPayload;
      writeSession(session);
      await new Promise((resolve) => setTimeout(resolve, 900));
      router.push(`/results?session=${session.id}`);
    } catch {
      setError("Something went wrong sorting dinner. Try again.");
      setLoading(false);
    }
  }

  if (!ready || !household) {
    return <p className="text-muted">Loading your household…</p>;
  }

  return (
    <div className="relative">
      {loading ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-3xl bg-background/85 backdrop-blur-sm">
          <p className="font-display text-3xl tracking-tight">Sorting dinner...</p>
          <p className="mt-3 animate-pulse-soft text-muted">Three options. That&apos;s it.</p>
        </div>
      ) : null}

      <section>
        <h2 className="font-display text-2xl tracking-tight">Who are we feeding?</h2>
        <p className="mt-2 text-muted">{household.household_name}</p>
        <p className="mt-1 text-lg">{formatPeople(adults, children)}</p>
        {editingWho ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">
              Adults
              <input
                type="number"
                min={1}
                max={8}
                value={adults}
                onChange={(event) => setAdults(Number(event.target.value))}
                className="mt-2 h-11 w-full rounded-2xl border border-border bg-card px-3"
              />
            </label>
            <label className="text-sm font-semibold">
              Children
              <input
                type="number"
                min={0}
                max={8}
                value={children}
                onChange={(event) => setChildren(Number(event.target.value))}
                className="mt-2 h-11 w-full rounded-2xl border border-border bg-card px-3"
              />
            </label>
          </div>
        ) : (
          <button
            type="button"
            className="mt-3 text-sm font-semibold text-accent underline-offset-4 hover:underline"
            onClick={() => setEditingWho(true)}
          >
            Edit
          </button>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl tracking-tight">Tonight feels like...</h2>
        <p className="mt-2 text-sm text-muted">Choose up to two.</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {MOODS.map((mood) => (
            <button
              key={mood.id}
              type="button"
              aria-pressed={moods.includes(mood.id)}
              onClick={() => toggleMood(mood.id)}
              className={`min-h-20 rounded-3xl border px-4 py-4 text-left text-base font-semibold transition ${
                moods.includes(mood.id)
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card hover:border-foreground/30"
              }`}
            >
              {mood.label}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl tracking-tight">Budget</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {TONIGHT_BUDGET_OPTIONS.map((option) => (
            <Chip
              key={option.id}
              selected={budgetId === option.id}
              onClick={() => setBudgetId(option.id)}
            >
              {option.label}
            </Chip>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <label className="block">
          <span className="font-display text-2xl tracking-tight">Anything else?</span>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
            placeholder="Something light, preferably not pizza."
            className="mt-4 w-full rounded-3xl border border-border bg-card px-4 py-3 outline-none"
          />
        </label>
      </section>

      {error ? <p className="mt-6 text-sm text-danger">{error}</p> : null}

      <Button size="lg" className="mt-8 w-full sm:w-auto" onClick={() => void submit()} disabled={loading}>
        Sort my dinner
      </Button>
    </div>
  );
}
