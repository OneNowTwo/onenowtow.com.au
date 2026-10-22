"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useHousehold } from "@/components/providers/HouseholdProvider";
import { track } from "@/lib/analytics";
import { BUDGET_OPTIONS, TONIGHT_MOODS } from "@/lib/constants";
import { formatBudgetLabel, formatPeopleTotal } from "@/lib/format";
import { suburbForPostcode } from "@/lib/postcodes";
import { clearSession, writeSession } from "@/lib/storage";
import type { RecommendationSessionPayload } from "@/lib/types";

export function SortForm() {
  const searchParams = useSearchParams();
  const tonightKey = searchParams.get("new") ?? "fresh";
  return <SortFormFields key={tonightKey} resetSession={searchParams.has("new")} />;
}

function SortFormFields({ resetSession }: { resetSession: boolean }) {
  const router = useRouter();
  const { household, ready } = useHousehold();
  const [moods, setMoods] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) return;
    if (!household) router.replace("/household?next=/sort");
  }, [household, ready, router]);

  useEffect(() => {
    if (resetSession) clearSession();
  }, [resetSession]);

  const budget = useMemo(() => {
    return (
      BUDGET_OPTIONS.find((option) => option.id === household?.typical_budget) ?? {
        min: 60,
        max: 80,
      }
    );
  }, [household?.typical_budget]);

  const summary = useMemo(() => {
    if (!household) return "";
    const suburb = suburbForPostcode(household.postcode) ?? household.postcode;
    const people = formatPeopleTotal(household.adults, household.children);
    const spend = formatBudgetLabel(household.typical_budget);
    return `${people} · ${suburb} · ${spend}`;
  }, [household]);

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
    track("sort_started", {
      moods,
      budgetId: household.typical_budget,
      adults: household.adults,
      children: household.children,
    });
    const input = {
      postcode: household.postcode,
      suburb: suburbForPostcode(household.postcode),
      adults: household.adults,
      children: household.children,
      dietaryRequirements: household.dietary_requirements,
      favouriteCuisines: household.favourite_cuisines,
      avoidedFoods: household.avoided_foods,
      moodTags: moods,
      budgetMin: budget.min,
      budgetMax: budget.max,
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

      <p className="text-lg text-ink-soft">{summary}</p>
      <Link
        href="/household?next=/sort"
        className="mt-2 inline-block cursor-pointer text-sm font-semibold text-accent underline-offset-4 hover:underline"
      >
        Change
      </Link>

      <section className="mt-10">
        <h2 className="sr-only">Tonight feels like</h2>
        <p className="text-sm text-muted">Choose up to two.</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {TONIGHT_MOODS.map((mood) => (
            <button
              key={mood.id}
              type="button"
              aria-pressed={moods.includes(mood.id)}
              onClick={() => toggleMood(mood.id)}
              className={`min-h-12 cursor-pointer rounded-3xl border px-4 py-4 text-left text-base font-semibold transition ${
                moods.includes(mood.id)
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card hover:border-foreground/40 hover:bg-muted-bg"
              }`}
            >
              {mood.label}
            </button>
          ))}
        </div>
      </section>

      {error ? <p className="mt-6 text-sm text-danger">{error}</p> : null}

      <Button size="lg" className="mt-10 w-full sm:w-auto" onClick={() => void submit()} disabled={loading}>
        Sort dinner
      </Button>
    </div>
  );
}
