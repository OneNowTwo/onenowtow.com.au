"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Video } from "@/lib/types/database";
import { MuxVideoPlayer } from "@/components/video/MuxVideoPlayer";
import { seedHostelsWithCounts, CATEGORY_LABELS } from "@/lib/seed/data";
import type { VideoCategory } from "@/lib/types/database";

export function AdminPendingVideos({ videos }: { videos: Video[] }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function moderate(videoId: string, action: "approve" | "reject") {
    setBusyId(videoId);
    setError(null);
    try {
      const res = await fetch("/api/admin/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId, action }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Action failed");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setBusyId(null);
    }
  }

  if (videos.length === 0) {
    return (
      <p className="rounded-2xl bg-muted-bg px-4 py-8 text-center text-sm text-muted">
        No pending Looksees.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      {videos.map((video) => {
        const hostel = seedHostelsWithCounts.find((h) => h.id === video.hostel_id);
        return (
          <article key={video.id} className="rounded-2xl bg-card p-4 ring-1 ring-border">
            <div className="relative mx-auto aspect-[9/14] max-w-xs overflow-hidden rounded-xl bg-black">
              {video.mux_playback_id ? (
                <MuxVideoPlayer
                  playbackId={video.mux_playback_id}
                  videoId={video.id}
                  active={false}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-white/70">
                  Playback not ready
                </div>
              )}
            </div>
            <div className="mt-4 space-y-1 text-sm">
              <p className="font-bold">{hostel?.name ?? video.hostel_id}</p>
              <p className="text-muted">
                {CATEGORY_LABELS[video.category as VideoCategory]} · Filmed {video.filmed_at}
              </p>
              <p className="text-muted">Submitted {new Date(video.created_at).toLocaleString()}</p>
              {video.caption ? <p>{video.caption}</p> : null}
              <p className="text-xs text-muted">Uploader: {video.user_id}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                disabled={busyId === video.id || !video.mux_playback_id}
                onClick={() => void moderate(video.id, "approve")}
                className="h-10 rounded-xl bg-accent px-4 text-sm font-bold text-white disabled:opacity-40"
              >
                Approve
              </button>
              <button
                type="button"
                disabled={busyId === video.id}
                onClick={() => void moderate(video.id, "reject")}
                className="h-10 rounded-xl bg-muted-bg px-4 text-sm font-bold"
              >
                Reject
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
