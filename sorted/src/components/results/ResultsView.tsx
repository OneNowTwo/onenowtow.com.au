"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DinnerCard } from "@/components/dinner/DinnerCard";
import { EmptyState } from "@/components/empty/EmptyState";
import { Button, ButtonLink } from "@/components/ui/Button";
import { track } from "@/lib/analytics";
import { readSession, subscribeSession, writeSession } from "@/lib/storage";
import type { RecommendationSessionPayload } from "@/lib/types";

export function ResultsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session = useSyncExternalStore(subscribeSession, readSession, () => null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (session) {
      track("recommendations_viewed", {
        sessionId: session.id,
        count: session.results.length,
      });
      return;
    }
    if (!searchParams.get("session")) router.replace("/sort");
  }, [router, searchParams, session]);

  async function refresh() {
    if (!session) return;
    setRefreshing(true);
    track("recommendation_refreshed", { sessionId: session.id });
    const response = await fetch("/api/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...session.input,
        excludeBundleIds: [
          ...(session.input.excludeBundleIds ?? []),
          ...session.results.map((item) => item.bundle.id),
        ],
      }),
    });
    const next = (await response.json()) as RecommendationSessionPayload;
    writeSession(next);
    setRefreshing(false);
    router.replace(`/results?session=${next.id}`);
  }

  if (!session) {
    return <p className="text-muted">Finding tonight&apos;s three…</p>;
  }

  if (session.results.length < 3) {
    return (
      <EmptyState
        title="We couldn't find three good matches tonight."
        body="That's rare, but it happens when the brief is very tight. Loosen one thing and try again."
        actionHref="/sort"
        actionLabel="Increase budget"
        secondary={
          <div className="flex flex-col items-center gap-3 text-sm">
            <ButtonLink href="/sort" variant="ghost">
              Remove a preference
            </ButtonLink>
            <ButtonLink href="/household?next=/sort" variant="ghost">
              Try nearby suburbs
            </ButtonLink>
          </div>
        }
      />
    );
  }

  return (
    <div>
      <div className={`grid gap-6 ${refreshing ? "opacity-60" : ""}`}>
        {session.results.map((result) => (
          <DinnerCard
            key={result.bundle.id}
            restaurant={result.restaurant}
            bundle={result.bundle}
            reason={result.reason}
            action={
              <Button
                className="w-full sm:w-auto"
                onClick={() => {
                  track("dinner_selected", {
                    bundleId: result.bundle.id,
                    restaurant: result.restaurant.name,
                  });
                  router.push(`/dinner/${result.bundle.id}?session=${session.id}`);
                }}
              >
                Choose this
              </Button>
            }
          />
        ))}
      </div>
      <div className="mt-10 text-center">
        <button
          type="button"
          onClick={() => void refresh()}
          className="text-sm font-semibold text-ink-soft underline-offset-4 hover:underline"
        >
          None of these? Give me three more.
        </button>
      </div>
    </div>
  );
}
