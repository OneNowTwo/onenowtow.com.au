"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { VideoCard } from "@/components/video/VideoCard";
import { VIDEO_CATEGORY_FILTERS } from "@/lib/constants";
import type { VideoCard as VideoCardType } from "@/lib/types/views";
import { cn } from "@/lib/utils/cn";

type Props = {
  videos: VideoCardType[];
  signedIn?: boolean;
  currentUserId?: string | null;
  helpfulVideoIds?: string[];
};

export function HostelVideoSection({
  videos,
  signedIn = false,
  currentUserId = null,
  helpfulVideoIds = [],
}: Props) {
  const [filter, setFilter] = useState<(typeof VIDEO_CATEGORY_FILTERS)[number]["value"]>(
    "all",
  );
  const helpfulSet = useMemo(() => new Set(helpfulVideoIds), [helpfulVideoIds]);

  const filtered = useMemo(() => {
    if (filter === "all") return videos;
    return videos.filter((v) => v.category === filter);
  }, [videos, filter]);

  return (
    <section>
      <h2 className="text-lg font-bold tracking-tight">What travellers actually saw</h2>
      <p className="mt-1 text-sm text-muted">Dates matter — newer Looksees first.</p>

      <div className="scrollbar-none mt-4 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:-mx-0 sm:px-0">
        {VIDEO_CATEGORY_FILTERS.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setFilter(item.value)}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition",
              filter === item.value
                ? "bg-foreground text-white"
                : "bg-muted-bg text-foreground/80 hover:bg-border",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {filtered.length === 0 ? (
          <div className="rounded-2xl bg-muted-bg px-4 py-8 text-center sm:col-span-2">
            <p className="font-semibold">
              No traveller Looksees yet. Be the first to show what it&apos;s really like.
            </p>
            <Link
              href="/upload"
              className="mt-4 inline-flex h-10 items-center rounded-xl bg-accent px-4 text-sm font-bold text-white"
            >
              Upload a Looksee
            </Link>
          </div>
        ) : (
          filtered.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              showHostelLink={false}
              compact
              signedIn={signedIn}
              currentUserId={currentUserId}
              initiallyHelpful={helpfulSet.has(video.id)}
            />
          ))
        )}
      </div>
    </section>
  );
}
