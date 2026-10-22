"use client";

import { useParams } from "next/navigation";
import { ChoiceFeedback } from "@/components/dinner/ChoiceFeedback";
import { FoodImage } from "@/components/dinner/FoodImage";
import { PrototypeNotice } from "@/components/brand/PrototypeNotice";
import { ButtonLink } from "@/components/ui/Button";
import { useCatalog } from "@/components/providers/useCatalog";
import { formatPrice } from "@/lib/format";
import { restaurantWebsite } from "@/lib/restaurants";

export default function OrderPage() {
  const params = useParams<{ id: string }>();
  const catalog = useCatalog();
  const bundle = catalog?.bundles.find((item) => item.id === params.id);
  const restaurant = catalog?.restaurants.find((item) => item.id === bundle?.restaurant_id);
  const row = bundle && restaurant ? { bundle, restaurant } : null;

  if (!catalog) return <div className="px-4 py-16 text-muted">Loading…</div>;
  if (!row) return <div className="px-4 py-16 text-muted">We couldn&apos;t find that dinner.</div>;

  const website = restaurantWebsite(row.restaurant);

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Selection</p>
      <h1 className="mt-3 font-display text-4xl tracking-tight">Good choice.</h1>
      <p className="mt-3 leading-relaxed text-ink-soft">
        For this prototype, the Sorted Pack is a concept rather than an official restaurant bundle.
      </p>
      <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-card">
        <div className="relative aspect-[16/10]">
          <FoodImage src={row.bundle.image_url} alt="" />
        </div>
        <div className="p-5">
          <h2 className="font-display text-2xl tracking-tight">{row.bundle.name}</h2>
          <p className="mt-1 text-sm font-semibold text-ink-soft">
            {row.restaurant.name} · {row.restaurant.suburb}
          </p>
          <p className="mt-2 text-ink-soft">{row.bundle.description}</p>
          <p className="mt-4 text-sm text-muted">Indicative {formatPrice(row.bundle.price)}</p>
        </div>
      </div>
      {website ? (
        <ButtonLink
          href={website}
          size="lg"
          className="mt-8 w-full sm:w-auto"
          target="_blank"
          rel="noreferrer"
        >
          View restaurant
        </ButtonLink>
      ) : (
        <p className="mt-8 text-sm text-muted">
          We don&apos;t have a verified website for this restaurant yet.
        </p>
      )}
      <div className="mt-10 border-t border-border pt-8">
        <ChoiceFeedback bundleId={row.bundle.id} restaurantName={row.restaurant.name} />
      </div>
      <div className="mt-8">
        <ButtonLink href={`/dinner/${row.bundle.id}`} variant="ghost">
          Back to dinner
        </ButtonLink>
      </div>
      <PrototypeNotice className="mt-10 text-xs leading-relaxed text-muted" />
    </div>
  );
}
