import type { Metadata } from "next";
import Link from "next/link";
import { AffiliateExplorer } from "@/components/rewards/AffiliateExplorer";
import { FaqList } from "@/components/rewards/FaqList";
import { POINTS_EARN, POINTS_REWARDS } from "@/lib/rewards/catalog";
import { REWARD_CATEGORY_LABELS } from "@/lib/rewards/catalog";

export const metadata: Metadata = {
  title: "Looksee Points",
  description:
    "Earn Looksee Points for real hostel videos. Spend them on pints, club entry, surf lessons, reef trips and a Harbour Bridge climb.",
};

export default function PointsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
        Rewards
      </p>
      <h1 className="mt-2 text-[2rem] font-extrabold leading-[1.1] tracking-tight sm:text-4xl">
        Film where you stayed. Get the night out.
      </h1>
      <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted">
        Looksee Points are for backpackers — pubs, bars, clubs, surf lessons, reef days and the
        Bridge climb. Not hotel points. Not airline miles.
      </p>

      <div className="mt-6 rounded-2xl bg-accent-soft px-4 py-3 text-sm text-foreground">
        You can earn points now. Venue redemption is rolling out city by city — show your balance
        at the partner when it goes live.
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-bold tracking-tight">How you earn</h2>
        <ul className="mt-4 space-y-3">
          {POINTS_EARN.map((item) => (
            <li
              key={item.id}
              className="flex gap-4 rounded-2xl bg-card p-4 ring-1 ring-border"
            >
              <p className="w-14 shrink-0 text-2xl font-extrabold tabular-nums text-accent">
                {item.points}
              </p>
              <div>
                <p className="font-bold">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{item.detail}</p>
              </div>
            </li>
          ))}
        </ul>
        <Link
          href="/upload"
          className="mt-4 inline-flex h-11 items-center rounded-xl bg-accent px-4 text-sm font-bold text-white hover:bg-accent-hover"
        >
          Upload a Looksee
        </Link>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-bold tracking-tight">What points get you</h2>
        <p className="mt-1 text-sm text-muted">
          One approved video ≈ a schooner. A few videos ≈ a night out or a lesson.
        </p>
        <ul className="mt-4 space-y-3">
          {POINTS_REWARDS.map((reward) => (
            <li
              key={reward.points}
              className="flex items-start justify-between gap-3 rounded-2xl bg-card p-4 ring-1 ring-border"
            >
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
                  {REWARD_CATEGORY_LABELS[reward.category]}
                </p>
                <p className="mt-1 font-bold">{reward.title}</p>
                <p className="mt-1 text-sm text-muted">{reward.detail}</p>
              </div>
              <p className="shrink-0 text-right">
                <span className="block text-lg font-extrabold tabular-nums">{reward.points}</span>
                <span className="text-[10px] font-semibold uppercase text-muted">pts</span>
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-bold tracking-tight">Partners by town</h2>
        <p className="mt-1 text-sm text-muted">
          East coast first — the places you’d actually spend a night.
        </p>
        <div className="mt-4">
          <AffiliateExplorer />
        </div>
      </section>

      <section className="mt-12 pb-8">
        <h2 className="text-lg font-bold tracking-tight">FAQ</h2>
        <div className="mt-4">
          <FaqList />
        </div>
      </section>
    </div>
  );
}
