import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { BookingCta } from "@/components/hostel/BookingCta";
import { HostelVideoSection } from "@/components/hostel/HostelVideoSection";
import { LookseeScore } from "@/components/hostel/LookseeScore";
import { RealitySummary } from "@/components/hostel/RealitySummary";
import { SaveHostelButton } from "@/components/hostel/SaveHostelButton";
import { PageAnalytics } from "@/components/analytics/PageAnalytics";
import { getSessionUser } from "@/lib/auth/session";
import { isHostelSaved, userHasHelpful } from "@/lib/db/engagement";
import {
  getDestinationById,
  getHostelBySlug,
  getVideosForHostel,
} from "@/lib/db/queries";
import { getApprovedRatingsForHostel } from "@/lib/db/videos";
import { buildRealitySummary } from "@/lib/utils/reality-summary";
import { vibeLabel } from "@/lib/utils/vibe";
import { seedHostelsWithCounts } from "@/lib/seed/data";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return seedHostelsWithCounts.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const hostel = await getHostelBySlug(slug);
  if (!hostel) return { title: "Hostel not found" };

  return {
    title: `${hostel.name} Traveller Videos & Reviews`,
    description: `See recent traveller-filmed videos of ${hostel.name} including dorms, bathrooms, common areas and the real hostel vibe.`,
  };
}

export default async function HostelPage({ params }: Props) {
  const { slug } = await params;
  const hostel = await getHostelBySlug(slug);
  if (!hostel) notFound();

  const session = await getSessionUser();
  const [destination, videos, ratings] = await Promise.all([
    getDestinationById(hostel.destination_id),
    getVideosForHostel(hostel.id),
    getApprovedRatingsForHostel(hostel.id).catch(() => []),
  ]);

  if (!destination) notFound();

  const summary = buildRealitySummary(hostel, ratings.length);
  const mapsUrl =
    hostel.latitude != null && hostel.longitude != null
      ? `https://www.google.com/maps/search/?api=1&query=${hostel.latitude},${hostel.longitude}`
      : null;

  const saved = session ? await isHostelSaved(session.id, hostel.id) : false;
  const helpfulVideoIds: string[] = [];
  if (session) {
    for (const video of videos) {
      if (await userHasHelpful(session.id, video.id)) {
        helpfulVideoIds.push(video.id);
      }
    }
  }

  return (
    <div className="mx-auto max-w-3xl pb-28">
      <PageAnalytics
        event="hostel_viewed"
        properties={{ hostel_slug: hostel.slug, destination_slug: destination.slug }}
      />

      <section className="relative h-52 overflow-hidden sm:h-64">
        {hostel.hero_image_url ? (
          <Image
            src={hostel.hero_image_url}
            alt={hostel.name}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="h-full w-full bg-muted-bg" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </section>

      <div className="px-4 sm:px-6">
        <header className="-mt-10 relative z-10 space-y-3 rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link
                href={`/destination/${destination.slug}`}
                className="text-xs font-semibold uppercase tracking-[0.12em] text-accent"
              >
                {destination.name}
              </Link>
              <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-[1.75rem]">
                {hostel.name}
              </h1>
            </div>
            <SaveHostelButton
              hostelId={hostel.id}
              hostelSlug={hostel.slug}
              initiallySaved={saved}
              signedIn={Boolean(session)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            {hostel.avg_overall != null ? (
              <span className="font-bold tabular-nums">
                {hostel.avg_overall.toFixed(1)}{" "}
                <span className="font-medium text-muted">Looksee</span>
              </span>
            ) : null}
            <span className="text-muted">·</span>
            <span className="text-muted">{videos.length} traveller videos</span>
            <span className="text-muted">·</span>
            <span className="rounded-md bg-accent-soft px-1.5 py-0.5 text-xs font-semibold text-accent">
              {vibeLabel(hostel.avg_vibe_score)}
            </span>
          </div>

          {hostel.address ? (
            <div className="flex items-start gap-2 text-sm text-muted">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              {mapsUrl ? (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  {hostel.address}
                </a>
              ) : (
                <span>{hostel.address}</span>
              )}
            </div>
          ) : null}

          {hostel.description ? (
            <p className="text-sm leading-relaxed text-foreground/85">{hostel.description}</p>
          ) : null}
        </header>

        <div className="mt-8 space-y-10">
          <HostelVideoSection
            videos={videos}
            signedIn={Boolean(session)}
            currentUserId={session?.id ?? null}
            helpfulVideoIds={helpfulVideoIds}
          />

          <div className="h-px bg-border" />

          <LookseeScore hostel={hostel} />

          <div className="h-px bg-border" />

          <RealitySummary lines={summary} />

          <p className="rounded-xl bg-muted-bg px-4 py-3 text-xs leading-relaxed text-muted">
            Real travellers. Recent videos. No marketing spin. Hostels cannot pay to remove
            traveller Looksees.
          </p>
        </div>
      </div>

      <BookingCta
        hostelId={hostel.id}
        hostelName={hostel.name}
        destination={destination.name}
        bookingUrl={hostel.preferred_booking_url}
      />
    </div>
  );
}
