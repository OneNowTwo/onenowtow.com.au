"use client";

import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useSyncExternalStore } from "react";
import { useFavourites } from "@/components/providers/FavouritesProvider";
import { Button, ButtonLink } from "@/components/ui/Button";
import { track } from "@/lib/analytics";
import { useCatalog } from "@/components/providers/useCatalog";
import { formatMinutes, formatPrice } from "@/lib/format";
import { readSession, subscribeSession } from "@/lib/storage";

export function DinnerDetail() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isSaved, toggle } = useFavourites();
  const catalog = useCatalog();
  const session = useSyncExternalStore(subscribeSession, readSession, () => null);
  const reason =
    session?.results.find((item) => item.bundle.id === params.id)?.reason ?? null;

  const row = catalog
    ? (() => {
        const bundle = catalog.bundles.find((item) => item.id === params.id);
        const restaurant = catalog.restaurants.find((item) => item.id === bundle?.restaurant_id);
        return bundle && restaurant ? { bundle, restaurant } : null;
      })()
    : null;

  const saved = row ? isSaved(row.bundle.id) : false;
  const sessionId = searchParams.get("session");

  const dietary = useMemo(() => {
    if (!row) return [];
    return row.bundle.dietary_tags.filter((tag) => tag !== "contains-nuts" && tag !== "seafood");
  }, [row]);

  if (!catalog) {
    return <p className="text-muted">Loading dinner…</p>;
  }

  if (!row) {
    return <p className="text-muted">We couldn&apos;t find that dinner.</p>;
  }

  const { bundle, restaurant } = row;

  return (
    <article>
      <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-muted-bg">
        <Image src={bundle.image_url} alt="" fill className="object-cover" priority sizes="800px" />
      </div>
      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
        {restaurant.name}
      </p>
      <h1 className="mt-2 font-display text-4xl tracking-tight">{bundle.name}</h1>
      <p className="mt-3 text-lg leading-relaxed text-ink-soft">{bundle.description}</p>

      <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-muted">Feeds</dt>
          <dd className="mt-1 font-semibold">{bundle.feeds_people}</dd>
        </div>
        <div>
          <dt className="text-muted">Price</dt>
          <dd className="mt-1 font-semibold">{formatPrice(bundle.price)}</dd>
        </div>
        <div>
          <dt className="text-muted">Ready in</dt>
          <dd className="mt-1 font-semibold">{formatMinutes(bundle.estimated_minutes)}</dd>
        </div>
        <div>
          <dt className="text-muted">Handoff</dt>
          <dd className="mt-1 font-semibold">Pickup or delivery</dd>
        </div>
      </dl>

      <div className="mt-8 border-t border-border pt-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">
          Restaurant
        </h2>
        <p className="mt-2">{restaurant.address}</p>
        <p className="text-muted">
          {restaurant.suburb} {restaurant.postcode}
        </p>
      </div>

      {dietary.length > 0 ? (
        <div className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">
            Dietary
          </h2>
          <p className="mt-2 capitalize text-ink-soft">{dietary.join(" · ").replaceAll("-", " ")}</p>
        </div>
      ) : null}

      <div className="mt-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">
          Why Sorted recommended it
        </h2>
        <p className="mt-2 leading-relaxed text-ink-soft">
          {reason ?? `A strong match from ${restaurant.suburb} that fits tonight.`}
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-3">
        <Button
          size="lg"
          onClick={() => {
            track("order_clicked", { bundleId: bundle.id, price: bundle.price });
            router.push(`/order/${bundle.id}`);
          }}
        >
          Order dinner — {formatPrice(bundle.price)}
        </Button>
        <p className="text-center text-sm text-muted">
          You&apos;ll complete your order directly with the restaurant.
        </p>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <Button variant="secondary" onClick={() => toggle(bundle.id)}>
            {saved ? "Saved to favourites" : "♡ Save to favourites"}
          </Button>
          <ButtonLink
            href={sessionId ? `/results?session=${sessionId}` : "/results"}
            variant="ghost"
          >
            Not tonight
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
