import Link from "next/link";
import Image from "next/image";
import type { DestinationCard } from "@/lib/types/views";

type Props = {
  destination: DestinationCard;
};

export function DestinationCardView({ destination }: Props) {
  return (
    <Link
      href={`/destination/${destination.slug}`}
      className="group relative block w-[72vw] max-w-[260px] shrink-0 overflow-hidden rounded-2xl ring-1 ring-border sm:w-56"
    >
      <div className="relative aspect-[4/5]">
        {destination.hero_image_url ? (
          <Image
            src={destination.hero_image_url}
            alt={destination.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="260px"
          />
        ) : (
          <div className="h-full w-full bg-muted-bg" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <h3 className="text-lg font-bold tracking-tight">{destination.name}</h3>
          <p className="mt-1 text-xs text-white/80">
            {destination.hostel_count} hostels · {destination.recent_looksee_count} recent
            Looksees
          </p>
        </div>
      </div>
    </Link>
  );
}
