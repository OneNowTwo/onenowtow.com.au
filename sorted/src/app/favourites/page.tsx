"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DinnerCard } from "@/components/dinner/DinnerCard";
import { EmptyState } from "@/components/empty/EmptyState";
import { Button, ButtonLink } from "@/components/ui/Button";
import { useFavourites } from "@/components/providers/FavouritesProvider";
import { useHousehold } from "@/components/providers/HouseholdProvider";
import { useCatalog } from "@/components/providers/useCatalog";
import { suburbForPostcode } from "@/lib/postcodes";
import { writeSession } from "@/lib/storage";
import type { DinnerBundle, RecommendationSessionPayload, Restaurant } from "@/lib/types";

export default function FavouritesPage() {
  const router = useRouter();
  const { favourites, ready, toggle } = useFavourites();
  const { household } = useHousehold();
  const catalog = useCatalog();
  const [similarId, setSimilarId] = useState<string | null>(null);

  const rows =
    catalog && ready
      ? favourites
          .map((fav) => {
            const bundle = catalog.bundles.find((item) => item.id === fav.dinner_bundle_id);
            const restaurant = catalog.restaurants.find((item) => item.id === bundle?.restaurant_id);
            if (!bundle || !restaurant) return null;
            return { bundle, restaurant };
          })
          .filter((row): row is NonNullable<typeof row> => row !== null)
      : [];

  async function findSimilar(bundle: DinnerBundle, restaurant: Restaurant) {
    setSimilarId(bundle.id);
    const moods = bundle.tags.filter((tag) =>
      ["quick", "healthy", "cheap", "kids", "treat", "high-protein"].includes(tag),
    );
    const response = await fetch("/api/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postcode: household?.postcode ?? "2095",
        suburb: household ? suburbForPostcode(household.postcode) : "Manly",
        adults: household?.adults ?? 2,
        children: household?.children ?? 2,
        dietaryRequirements: household?.dietary_requirements ?? [],
        favouriteCuisines: [restaurant.cuisine],
        avoidedFoods: household?.avoided_foods ?? "",
        moodTags: moods.slice(0, 2),
        budgetMin: Math.max(0, bundle.price - 20),
        budgetMax: bundle.price + 20,
        excludeBundleIds: [bundle.id],
      }),
    });
    if (response.ok) {
      const session = (await response.json()) as RecommendationSessionPayload;
      writeSession(session);
      router.push(`/results?session=${session.id}`);
      return;
    }
    setSimilarId(null);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Favourites</p>
      <h1 className="mt-3 font-display text-4xl tracking-tight">Saved dinners</h1>
      {!ready || !catalog ? (
        <p className="mt-10 text-muted">Loading…</p>
      ) : rows.length === 0 ? (
        <EmptyState
          title="Nothing saved yet."
          body="When dinner hits the spot, save it here for next time."
          actionHref="/sort"
          actionLabel="Sort tonight's dinner"
        />
      ) : (
        <div className="mt-10 grid gap-6">
          {rows.map((row) => (
            <DinnerCard
              key={row.bundle.id}
              restaurant={row.restaurant}
              bundle={row.bundle}
              action={
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <ButtonLink href={`/dinner/${row.bundle.id}`} size="sm">
                    Choose again
                  </ButtonLink>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={similarId === row.bundle.id}
                    onClick={() => void findSimilar(row.bundle, row.restaurant)}
                  >
                    Find something similar
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => toggle(row.bundle.id)}>
                    Remove
                  </Button>
                </div>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
