"use client";

import { useMemo, useState } from "react";
import {
  AFFILIATE_OFFERS,
  destinationSlugsWithAffiliates,
} from "@/lib/rewards/catalog";
import { AffiliateList } from "@/components/rewards/AffiliateList";

export function AffiliateExplorer() {
  const destinations = destinationSlugsWithAffiliates();
  const [slug, setSlug] = useState<string>("all");

  const offers = useMemo(() => {
    if (slug === "all") return AFFILIATE_OFFERS;
    return AFFILIATE_OFFERS.filter((offer) => offer.destinationSlug === slug);
  }, [slug]);

  return (
    <div>
      <div className="scrollbar-none flex gap-2 overflow-x-auto pb-3">
        <button
          type="button"
          onClick={() => setSlug("all")}
          className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold ${
            slug === "all" ? "bg-foreground text-white" : "bg-muted-bg"
          }`}
        >
          All towns
        </button>
        {destinations.map((destination) => (
          <button
            key={destination.slug}
            type="button"
            onClick={() => setSlug(destination.slug)}
            className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold ${
              slug === destination.slug ? "bg-foreground text-white" : "bg-muted-bg"
            }`}
          >
            {destination.name}
          </button>
        ))}
      </div>
      <AffiliateList offers={offers} showDestination={slug === "all"} />
    </div>
  );
}
