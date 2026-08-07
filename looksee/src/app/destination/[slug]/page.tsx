import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { HostelCardView } from "@/components/hostel/HostelCard";
import { PageAnalytics } from "@/components/analytics/PageAnalytics";
import {
  getDestinationBySlug,
  getHostelsByDestination,
  getTrendingDestinations,
} from "@/lib/db/queries";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const destinations = await getTrendingDestinations();
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);
  if (!destination) return { title: "Destination not found" };

  return {
    title: `${destination.name} Hostel Videos & Reviews`,
    description: `See recent traveller-filmed videos of hostels in ${destination.name}. Real dorms, bathrooms, kitchens and vibe — not marketing photos.`,
  };
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);
  if (!destination) notFound();

  const hostels = await getHostelsByDestination(destination.id);
  const recentLooksees = hostels.reduce((sum, h) => sum + h.video_count, 0);

  return (
    <div className="mx-auto max-w-3xl">
      <PageAnalytics
        event="destination_viewed"
        properties={{ destination_slug: destination.slug }}
      />

      <section className="relative h-56 overflow-hidden sm:h-72">
        {destination.hero_image_url ? (
          <Image
            src={destination.hero_image_url}
            alt={destination.name}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="h-full w-full bg-muted-bg" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />
        <div className="absolute inset-x-0 bottom-0 px-4 pb-6 sm:px-6">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/70">
            {destination.country}
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {destination.name}
          </h1>
          <p className="mt-2 max-w-lg text-sm text-white/85">
            {destination.description}
          </p>
          <p className="mt-3 text-xs font-medium text-white/75">
            {hostels.length} hostels · {recentLooksees} Looksees
          </p>
        </div>
      </section>

      <section className="space-y-3 px-4 py-6 sm:px-6">
        <h2 className="text-lg font-bold tracking-tight">Hostels</h2>
        {hostels.length === 0 ? (
          <p className="text-sm text-muted">No hostels yet for this destination.</p>
        ) : (
          hostels.map((hostel) => <HostelCardView key={hostel.id} hostel={hostel} />)
        )}
      </section>
    </div>
  );
}
