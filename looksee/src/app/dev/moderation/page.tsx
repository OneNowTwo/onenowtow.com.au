"use client";

import { useState } from "react";
import Link from "next/link";
import type { Video } from "@/lib/types/database";

type PendingResponse = { videos: Video[]; error?: string };

export default function DevModerationPage() {
  const [videos, setVideos] = useState<Video[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/dev/approve-video");
      const data = (await res.json()) as PendingResponse;
      if (!res.ok) {
        throw new Error(data.error ?? "Dev moderation is unavailable.");
      }
      setVideos(data.videos);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load pending videos.");
    } finally {
      setLoading(false);
    }
  }

  async function approve(videoId: string) {
    setMessage(null);
    setError(null);
    const res = await fetch("/api/dev/approve-video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoId }),
    });
    const data = (await res.json()) as { error?: string; video?: Video };
    if (!res.ok) {
      setError(data.error ?? "Could not approve video.");
      return;
    }
    setMessage(`Approved ${videoId}`);
    await load();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-danger">
        Development only
      </p>
      <h1 className="mt-2 text-2xl font-extrabold tracking-tight">Approve Looksees</h1>
      <p className="mt-2 text-sm text-muted">
        Temporary moderation shortcut until the admin dashboard ships. Not available in
        production unless <code>ALLOW_DEV_MODERATION=true</code>.
      </p>

      <button
        type="button"
        onClick={() => void load()}
        className="mt-5 h-10 rounded-xl bg-foreground px-4 text-sm font-bold text-white"
      >
        {videos ? "Refresh" : "Load pending videos"}
      </button>

      {loading ? <p className="mt-6 text-sm text-muted">Loading…</p> : null}
      {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      {message ? <p className="mt-4 text-sm text-success">{message}</p> : null}

      <div className="mt-6 space-y-3">
        {videos && videos.length === 0 && !loading ? (
          <p className="rounded-2xl bg-muted-bg px-4 py-8 text-center text-sm text-muted">
            No pending uploads right now.
          </p>
        ) : null}
        {(videos ?? []).map((video) => (
          <div key={video.id} className="rounded-2xl bg-card p-4 ring-1 ring-border">
            <p className="text-sm font-semibold">{video.id}</p>
            <p className="mt-1 text-xs text-muted">
              status: {video.status} · category: {video.category} · filmed: {video.filmed_at}
            </p>
            <p className="mt-1 text-xs text-muted">
              playback: {video.mux_playback_id ?? "not ready"}
            </p>
            {video.caption ? <p className="mt-2 text-sm">{video.caption}</p> : null}
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                disabled={!video.mux_playback_id}
                onClick={() => void approve(video.id)}
                className="h-10 rounded-xl bg-accent px-4 text-sm font-bold text-white disabled:opacity-40"
              >
                Approve
              </button>
              <Link
                href="/search"
                className="inline-flex h-10 items-center rounded-xl bg-muted-bg px-3 text-sm font-medium"
              >
                Browse hostels
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
