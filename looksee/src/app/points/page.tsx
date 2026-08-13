import type { Metadata } from "next";
import Link from "next/link";
import { AffiliateExplorer } from "@/components/rewards/AffiliateExplorer";
import { FaqList } from "@/components/rewards/FaqList";
import { POINTS_EARN, POINTS_REWARDS, REWARD_CATEGORY_LABELS } from "@/lib/rewards/catalog";

export const metadata: Metadata = {
  title: "Looksee Points",
  description:
    "Earn Looksee Points for useful hostel videos. Spend them on schooners, club entry, surf lessons, reef trips and BridgeClimb — Looksee’s backpacker currency, not a bank.",
};

const SPEND_STEPS = [
  {
    n: "1",
    title: "Film something useful",
    body: "A real hostel walkthrough. We review it. Approved Looksee = 100 points (200 on your first).",
  },
  {
    n: "2",
    title: "See a deal in town",
    body: "100 pts → schooner. 200 → nightclub door. 400 → surf discount. The venue is listed in the app.",
  },
  {
    n: "3",
    title: "Show your code",
    body: "When partners go live: QR or code on your profile. They scan it, you get the reward, points leave your account.",
  },
  {
    n: "4",
    title: "They get a customer",
    body: "Looksee created the points. The bar just gave away a $2–$3 schooner to get you (and usually your mates) in the door.",
  },
] as const;

export default function PointsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
        Backpacker currency
      </p>
      <h1 className="mt-2 text-[2rem] font-extrabold leading-[1.1] tracking-tight sm:text-4xl">
        Upload useful stuff. Earn free drinks and discounts while you travel.
      </h1>
      <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted">
        Looksee Points are marketing currency — not cash, not a bank, not something venues have
        to buy. We issue the points. Partners give the reward.
      </p>

      <div className="mt-6 rounded-2xl bg-accent-soft px-4 py-3 text-sm text-foreground">
        You can earn now. First venues join free. Redemption (QR / code at the bar) rolls out
        city by city once those partners are live.
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
          Three useful videos ≈ 300–400 pts — already a schooner plus a night out.
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
        <h2 className="text-lg font-bold tracking-tight">How spending works</h2>
        <ol className="mt-4 space-y-3">
          {SPEND_STEPS.map((step) => (
            <li key={step.n} className="flex gap-3 rounded-2xl bg-card p-4 ring-1 ring-border">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-extrabold text-accent">
                {step.n}
              </span>
              <div>
                <p className="font-bold">{step.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-bold tracking-tight">Partners by town</h2>
        <p className="mt-1 text-sm text-muted">
          East coast first. These are the kinds of spots we’d take backpackers — first partners
          join free while we prove the foot traffic.
        </p>
        <div className="mt-4">
          <AffiliateExplorer />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-bold tracking-tight">For venues</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          You’re not buying points, and you don’t pay twice. You’re offering a Looksee-only
          reason to walk in — a schooner that costs you a couple of dollars, $20 off a $90
          lesson, door entry — and Looksee sends backpackers who are already in your town.
        </p>
        <ul className="mt-4 space-y-3 text-sm">
          <li className="rounded-2xl bg-card p-4 ring-1 ring-border">
            <p className="font-bold">Bar example</p>
            <p className="mt-1 leading-relaxed text-muted">
              Free schooner (maybe $2–$3 cost). They come with four mates and spend $80. You
              acquired a table, not a points invoice.
            </p>
          </li>
          <li className="rounded-2xl bg-card p-4 ring-1 ring-border">
            <p className="font-bold">Surf school example</p>
            <p className="mt-1 leading-relaxed text-muted">
              400 pts = $20 off a $90 lesson. They still pay $70. Looksee brought the booking.
            </p>
          </li>
          <li className="rounded-2xl bg-card p-4 ring-1 ring-border">
            <p className="font-bold">MVP</p>
            <p className="mt-1 leading-relaxed text-muted">
              First partners are free. We want to show: Looksee sent you X backpackers, Y
              redeemed, they spent $Z. Then a monthly listing or a small fee per customer is a
              conversation — not a tax on the beer.
            </p>
          </li>
        </ul>
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
