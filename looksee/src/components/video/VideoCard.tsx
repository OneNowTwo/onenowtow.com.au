"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HelpfulButton } from "@/components/video/HelpfulButton";
import { ReportVideoButton } from "@/components/video/ReportVideoButton";
import { ThumbsUp, Volume2, VolumeX } from "lucide-react";
import { MuxVideoPlayer } from "@/components/video/MuxVideoPlayer";
import { CATEGORY_LABELS } from "@/lib/seed/data";
import type { VideoCategory } from "@/lib/types/database";
import type { VideoCard as VideoCardType } from "@/lib/types/views";
import { filmedLabel } from "@/lib/utils/dates";
import { cn } from "@/lib/utils/cn";
import { track } from "@/lib/analytics/posthog";

type Props = {
  video: VideoCardType;
  compact?: boolean;
  showHostelLink?: boolean;
  className?: string;
  signedIn?: boolean;
  currentUserId?: string | null;
  initiallyHelpful?: boolean;
  showModerationActions?: boolean;
};

export function VideoCard({
  video,
  compact = false,
  showHostelLink = true,
  className,
  signedIn = false,
  currentUserId = null,
  initiallyHelpful = false,
  showModerationActions = true,
}: Props) {
  const nativeRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const [muted, setMuted] = useState(true);
  const [inView, setInView] = useState(false);
  const [nearView, setNearView] = useState(false);

  const hasMux = Boolean(video.mux_playback_id);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setNearView(entry.isIntersecting);
        setInView(entry.isIntersecting && entry.intersectionRatio >= 0.55);
      },
      { threshold: [0, 0.25, 0.55], rootMargin: "200px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (hasMux) return;
    const node = nativeRef.current;
    if (!node) return;

    if (inView) {
      void node.play().catch(() => undefined);
      if (!startedRef.current) {
        startedRef.current = true;
        track("video_started", { video_id: video.id, hostel_slug: video.hostel_slug });
      }
    } else {
      node.pause();
    }
  }, [inView, hasMux, video.id, video.hostel_slug]);

  const categoryLabel =
    CATEGORY_LABELS[video.category as VideoCategory] ?? video.category;

  return (
    <article
      ref={containerRef}
      className={cn(
        "overflow-hidden rounded-2xl bg-card shadow-[0_1px_0_rgba(0,0,0,0.04)] ring-1 ring-border",
        className,
      )}
    >
      <div className={cn("relative bg-black", compact ? "aspect-[9/14]" : "aspect-[9/13]")}>
        {hasMux && nearView && video.mux_playback_id ? (
          <MuxVideoPlayer
            playbackId={video.mux_playback_id}
            poster={video.placeholder_poster_url}
            videoId={video.id}
            hostelSlug={video.hostel_slug}
            active={inView}
          />
        ) : video.placeholder_video_url && nearView ? (
          <video
            ref={nativeRef}
            className="h-full w-full object-cover"
            src={video.placeholder_video_url}
            poster={video.placeholder_poster_url ?? undefined}
            muted={muted}
            loop
            playsInline
            preload="metadata"
            onClick={() => setMuted((m) => !m)}
          />
        ) : video.placeholder_poster_url ? (
          <Image
            src={video.placeholder_poster_url}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 420px"
          />
        ) : (
          <div className="h-full w-full bg-muted-bg" />
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

        <div className="absolute left-3 top-3 z-10 rounded-md bg-black/55 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          {filmedLabel(video.filmed_at)}
        </div>

        {!hasMux ? (
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            className="absolute bottom-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm"
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        ) : null}

        <div className="pointer-events-none absolute bottom-3 left-3 right-14 z-10 space-y-1 text-white">
          <span className="inline-flex rounded-md bg-white/15 px-2 py-0.5 text-[11px] font-medium backdrop-blur-sm">
            {categoryLabel}
          </span>
          {showHostelLink ? (
            <Link
              href={`/hostel/${video.hostel_slug}`}
              className="pointer-events-auto block text-base font-bold leading-tight"
            >
              {video.hostel_name}
            </Link>
          ) : null}
          <p className="text-xs text-white/80">{video.destination_name}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 px-3.5 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="relative h-8 w-8 overflow-hidden rounded-full bg-muted-bg">
            {video.contributor_avatar_url ? (
              <Image
                src={video.contributor_avatar_url}
                alt=""
                fill
                className="object-cover"
                sizes="32px"
              />
            ) : null}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{video.contributor_first_name}</p>
            {video.caption ? (
              <p className="truncate text-xs text-muted">{video.caption}</p>
            ) : null}
          </div>
        </div>
        {showModerationActions ? (
          <div className="flex shrink-0 flex-col items-end gap-1">
            <HelpfulButton
              videoId={video.id}
              initialCount={video.helpful_count}
              initiallyHelpful={initiallyHelpful}
              isOwner={Boolean(currentUserId && currentUserId === video.user_id)}
              signedIn={signedIn}
            />
            <ReportVideoButton videoId={video.id} signedIn={signedIn} />
          </div>
        ) : (
          <div className="flex shrink-0 items-center gap-1 text-sm text-muted">
            <ThumbsUp className="h-3.5 w-3.5" />
            <span className="font-medium tabular-nums">{video.helpful_count}</span>
          </div>
        )}
      </div>
    </article>
  );
}
