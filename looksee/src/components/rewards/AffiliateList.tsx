import Link from "next/link";
import type { AffiliateOffer } from "@/lib/rewards/catalog";
import { REWARD_CATEGORY_LABELS } from "@/lib/rewards/catalog";

export function AffiliateList({
  offers,
  showDestination = false,
}: {
  offers: AffiliateOffer[];
  showDestination?: boolean;
}) {
  if (offers.length === 0) {
    return (
      <p className="rounded-2xl bg-muted-bg px-4 py-6 text-sm text-muted">
        Partners for this town are lining up. Earn points now — spend them when the venue goes
        live.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {offers.map((offer) => (
        <li
          key={offer.id}
          className="rounded-2xl bg-card p-4 ring-1 ring-border"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
                {REWARD_CATEGORY_LABELS[offer.category]}
                {showDestination ? ` · ${offer.destinationName}` : ` · ${offer.area}`}
              </p>
              <h3 className="mt-1 text-[15px] font-bold tracking-tight">{offer.name}</h3>
              <p className="mt-1 text-sm text-muted">{offer.offer}</p>
            </div>
            <p className="shrink-0 rounded-lg bg-accent-soft px-2.5 py-1 text-right">
              <span className="block text-sm font-extrabold tabular-nums text-accent">
                {offer.pointsCost}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-accent">
                pts
              </span>
            </p>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted">{offer.blurb}</p>
          <p className="mt-2 text-xs text-muted">
            About {offer.valueLabel} · Coming soon at the venue
          </p>
        </li>
      ))}
    </ul>
  );
}

export function PointsPromoBanner() {
  return (
    <Link
      href="/points"
      className="block overflow-hidden rounded-2xl bg-foreground px-4 py-5 text-white ring-1 ring-border sm:px-5"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">
        Looksee Points
      </p>
      <p className="mt-1 text-lg font-extrabold tracking-tight">
        Film a hostel. Get a pint. Or a surf lesson.
      </p>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-white/75">
        100 points per approved Looksee. Spend them on pubs, clubs, surf schools, reef trips and
        a Harbour Bridge climb.
      </p>
      <span className="mt-3 inline-flex text-sm font-bold text-accent">See rewards →</span>
    </Link>
  );
}
