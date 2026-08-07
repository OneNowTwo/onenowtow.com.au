"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Volume2, VolumeX } from "lucide-react";
import { track } from "@/lib/analytics/posthog";
import { cn } from "@/lib/utils/cn";

const MuxPlayer = dynamic(() => import("@mux/mux-player-react"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse-soft bg-black/80" />,
});

type Props = {
  playbackId: string;
  poster?: string | null;
  videoId: string;
  hostelSlug?: string;
  active: boolean;
  className?: string;
};

type MuxMediaElement = HTMLElement & {
  muted: boolean;
  currentTime: number;
  duration: number;
  paused: boolean;
  play: () => Promise<void>;
  pause: () => void;
};

export function MuxVideoPlayer({
  playbackId,
  poster,
  videoId,
  hostelSlug,
  active,
  className,
}: Props) {
  const playerRef = useRef<MuxMediaElement | null>(null);
  const [muted, setMuted] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const startedRef = useRef(false);
  const marked25 = useRef(false);
  const marked50 = useRef(false);
  const completedRef = useRef(false);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    if (active) {
      player.muted = muted;
      void player.play().catch(() => undefined);
      if (!startedRef.current) {
        startedRef.current = true;
        track("video_started", { video_id: videoId, hostel_slug: hostelSlug });
      }
    } else {
      player.pause();
    }
  }, [active, muted, videoId, hostelSlug]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const onTimeUpdate = () => {
      const duration = player.duration;
      if (!duration || !Number.isFinite(duration)) return;
      const ratio = player.currentTime / duration;
      if (ratio >= 0.25 && !marked25.current) {
        marked25.current = true;
        track("video_25_percent", { video_id: videoId });
      }
      if (ratio >= 0.5 && !marked50.current) {
        marked50.current = true;
        track("video_50_percent", { video_id: videoId });
      }
      if (ratio >= 0.95 && !completedRef.current) {
        completedRef.current = true;
        track("video_completed", { video_id: videoId });
      }
    };

    const onError = () => {
      setError("This Looksee couldn’t play. Try again in a moment.");
    };

    player.addEventListener("timeupdate", onTimeUpdate);
    player.addEventListener("error", onError);
    return () => {
      player.removeEventListener("timeupdate", onTimeUpdate);
      player.removeEventListener("error", onError);
    };
  }, [videoId, playbackId]);

  return (
    <div
      className={cn("relative h-full w-full bg-black", className)}
      onClick={() => setMuted((m) => !m)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") setMuted((m) => !m);
      }}
      role="presentation"
    >
      {error ? (
        <div className="flex h-full items-center justify-center px-6 text-center text-sm text-white/80">
          {error}
        </div>
      ) : (
        <MuxPlayer
          ref={playerRef as never}
          playbackId={playbackId}
          streamType="on-demand"
          poster={poster ?? undefined}
          muted={muted}
          loop
          playsInline
          preload={active ? "auto" : "metadata"}
          crossOrigin="anonymous"
          className="looksee-mux-player h-full w-full object-cover"
        />
      )}

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setMuted((m) => !m);
        }}
        className="absolute bottom-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm"
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
