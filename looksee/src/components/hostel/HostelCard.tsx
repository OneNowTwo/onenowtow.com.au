import Link from "next/link";
import Image from "next/image";
import { Bookmark } from "lucide-react";
import type { HostelCard } from "@/lib/types/views";
import { vibeLabel } from "@/lib/utils/vibe";
import { filmedLabel } from "@/lib/utils/dates";

type Props = {
  hostel: HostelCard;
  showSave?: boolean;
};

export function HostelCardView({ hostel, showSave = false }: Props) {
  const vibe = vibeLabel(hostel.avg_vibe_score);

  return (
    <Link
      href={`/hostel/${hostel.slug}`}
      className="group flex gap-3 overflow-hidden rounded-2xl bg-card p-2.5 ring-1 ring-border transition hover:ring-accent/40"
    >
      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-muted-bg">
        {hostel.hero_image_url ? (
          <Image
            src={hostel.hero_image_url}
            alt=""
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="112px"
          />
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[15px] font-bold leading-snug tracking-tight">{hostel.name}</h3>
            {showSave ? (
              <Bookmark className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden />
            ) : null}
          </div>
          <p className="mt-0.5 text-xs text-muted">{hostel.destination_name}</p>
        </div>

        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
            {hostel.avg_overall != null ? (
              <span className="font-semibold tabular-nums">
                {hostel.avg_overall.toFixed(1)}
                <span className="font-medium text-muted"> Looksee</span>
              </span>
            ) : null}
            <span className="text-muted">·</span>
            <span className="text-muted">{hostel.video_count} videos</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-md bg-muted-bg px-1.5 py-0.5 font-medium text-foreground/80">
              {vibe}
            </span>
            {hostel.price_from_aud != null ? (
              <span className="text-muted">from ${hostel.price_from_aud}/night</span>
            ) : null}
          </div>
          {hostel.most_recent_filmed_at ? (
            <p className="text-[11px] font-medium text-accent">
              {filmedLabel(hostel.most_recent_filmed_at)}
            </p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
