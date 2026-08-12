import { NextResponse } from "next/server";
import { AuthError, requireAuthUserId } from "@/lib/auth/session";
import { isSupabaseConfigured } from "@/lib/env";
import { listVideosForUser, syncStaleMuxVideos } from "@/lib/db/videos";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const userId = await requireAuthUserId();
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
    }

    let videos = await listVideosForUser(userId);
    const before = videos.map((v) => ({ id: v.id, status: v.status }));

    await syncStaleMuxVideos(videos);

    videos = await listVideosForUser(userId);
    const after = videos.map((v) => ({
      id: v.id,
      status: v.status,
      mux_playback_id: v.mux_playback_id,
    }));

    return NextResponse.json({ ok: true, before, after });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "Sync failed";
    console.error("[uploads/sync-stale]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
