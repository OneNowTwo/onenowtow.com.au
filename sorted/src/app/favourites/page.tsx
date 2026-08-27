"use client";

import { DinnerCard } from "@/components/dinner/DinnerCard";
import { EmptyState } from "@/components/empty/EmptyState";
import { useFavourites } from "@/components/providers/FavouritesProvider";
import { useCatalog } from "@/components/providers/useCatalog";

export default function FavouritesPage() {
  const { favourites, ready } = useFavourites();
  const catalog = useCatalog();
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
              href={`/dinner/${row.bundle.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
