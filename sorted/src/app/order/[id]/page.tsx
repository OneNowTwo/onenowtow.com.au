"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { useCatalog } from "@/components/providers/useCatalog";
import { formatPrice } from "@/lib/format";

export default function OrderPage() {
  const params = useParams<{ id: string }>();
  const catalog = useCatalog();
  const bundle = catalog?.bundles.find((item) => item.id === params.id);
  const restaurant = catalog?.restaurants.find((item) => item.id === bundle?.restaurant_id);
  const row = bundle && restaurant ? { bundle, restaurant } : null;

  if (!row) return <div className="px-4 py-16 text-muted">Loading checkout…</div>;

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
        Restaurant checkout
      </p>
      <h1 className="mt-3 font-display text-4xl tracking-tight">Almost there.</h1>
      <p className="mt-3 text-muted leading-relaxed">
        This is a simulated handoff. In the real product you&apos;d finish this order on{" "}
        {row.restaurant.name}&apos;s site.
      </p>
      <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-card">
        <div className="relative aspect-[16/10]">
          <Image src={row.bundle.image_url} alt="" fill className="object-cover" />
        </div>
        <div className="p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            {row.restaurant.name}
          </p>
          <p className="mt-1 font-display text-2xl">{row.bundle.name}</p>
          <p className="mt-2 text-ink-soft">{row.bundle.description}</p>
          <p className="mt-4 font-semibold">{formatPrice(row.bundle.price)}</p>
        </div>
      </div>
      <a
        href={row.restaurant.ordering_url}
        className="mt-8 inline-flex h-12 items-center rounded-full bg-accent px-7 font-semibold text-white hover:bg-accent-hover"
        target="_blank"
        rel="noreferrer"
      >
        Continue to {row.restaurant.name}
      </a>
      <div className="mt-4">
        <ButtonLink href={`/dinner/${row.bundle.id}`} variant="ghost">
          Back to dinner
        </ButtonLink>
      </div>
    </div>
  );
}
