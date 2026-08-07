import Link from "next/link";
import { Search } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { DestinationCardView } from "@/components/destination/DestinationCard";
import { VideoCard } from "@/components/video/VideoCard";
import { getRecentVideos, getTrendingDestinations } from "@/lib/db/queries";
import { SEARCH_EXAMPLES } from "@/lib/seed/data";
import { HomepageAnalytics } from "@/components/analytics/PageAnalytics";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [destinations, videos] = await Promise.all([
    getTrendingDestinations(),
    getRecentVideos(10),
  ]);

  return (
    <div className="mx-auto max-w-3xl">
      <HomepageAnalytics />

      <section className="relative overflow-hidden px-4 pb-8 pt-6 sm:px-6 sm:pt-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 10% -10%, #fff1e8 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 100% 0%, #f0efec 0%, transparent 50%)",
          }}
        />

        <div className="animate-fade-up flex items-center justify-between lg:hidden">
          <Logo />
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
            Real travellers
          </p>
        </div>

        <div className="animate-fade-up mt-8 max-w-xl" style={{ animationDelay: "60ms" }}>
          <h1 className="text-[2rem] font-extrabold leading-[1.1] tracking-tight sm:text-4xl">
            See where you&apos;re actually staying.
          </h1>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">
            Recent hostel videos filmed by travellers — not marketing teams.
          </p>
        </div>

        <form
          action="/search"
          className="animate-fade-up mt-7"
          style={{ animationDelay: "120ms" }}
        >
          <label htmlFor="home-search" className="sr-only">
            Where are you going?
          </label>
          <div className="flex items-center gap-2 rounded-2xl bg-card p-2 shadow-sm ring-1 ring-border">
            <Search className="ml-2 h-5 w-5 shrink-0 text-muted" />
            <input
              id="home-search"
              name="q"
              type="search"
              placeholder="Where are you going?"
              className="h-11 w-full bg-transparent text-[15px] outline-none placeholder:text-muted"
            />
            <button
              type="submit"
              className="h-11 shrink-0 rounded-xl bg-accent px-4 text-sm font-bold text-white hover:bg-accent-hover"
            >
              Search
            </button>
          </div>
        </form>

        <div
          className="animate-fade-up mt-3 flex flex-wrap gap-2"
          style={{ animationDelay: "160ms" }}
        >
          {SEARCH_EXAMPLES.map((example) => (
            <Link
              key={example}
              href={`/search?q=${encodeURIComponent(example)}`}
              className="rounded-lg bg-muted-bg px-3 py-1.5 text-xs font-medium text-foreground/80 transition hover:bg-accent-soft hover:text-accent"
            >
              {example}
            </Link>
          ))}
        </div>
      </section>

      <section className="px-4 pb-8 sm:px-6">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-lg font-bold tracking-tight">Trending destinations</h2>
          <Link href="/search" className="text-sm font-medium text-accent">
            See all
          </Link>
        </div>
        <div className="scrollbar-none -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6">
          {destinations.map((destination) => (
            <DestinationCardView key={destination.id} destination={destination} />
          ))}
        </div>
      </section>

      <section className="px-4 pb-6 sm:px-6">
        <div className="mb-4">
          <h2 className="text-lg font-bold tracking-tight">Recently checked out</h2>
          <p className="mt-1 text-sm text-muted">Tap for sound · scroll for more</p>
        </div>
        <div className="mx-auto flex max-w-md flex-col gap-5">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </section>

      <p className="px-4 pb-8 text-center text-xs text-muted sm:px-6">
        Real travellers. Recent videos. No marketing spin.
      </p>
    </div>
  );
}
