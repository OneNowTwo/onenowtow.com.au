import { randomUUID } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { allowLocalDataStore, isSupabaseConfigured } from "@/lib/env";
import { awardPointsAdmin } from "@/lib/db/points";
import {
  createLocalSuggestion,
  createLocalVideo,
  getLocalVideo,
  getLocalVideoByAssetId,
  getLocalVideoByUploadId,
  listLocalVideos,
  shouldApplyStatus,
  updateLocalVideo,
} from "@/lib/db/video-store";
import type {
  HostelSuggestion,
  Rating,
  Video,
  VideoCategory,
  VideoStatus,
} from "@/lib/types/database";

function mapVideo(row: Record<string, unknown>): Video {
  return {
    id: String(row.id),
    user_id: String(row.user_id),
    hostel_id: String(row.hostel_id),
    mux_upload_id: (row.mux_upload_id as string | null) ?? null,
    mux_asset_id: (row.mux_asset_id as string | null) ?? null,
    mux_playback_id: (row.mux_playback_id as string | null) ?? null,
    placeholder_video_url: (row.placeholder_video_url as string | null) ?? null,
    placeholder_poster_url: (row.placeholder_poster_url as string | null) ?? null,
    category: row.category as VideoCategory,
    caption: (row.caption as string | null) ?? null,
    status: row.status as VideoStatus,
    filmed_at: String(row.filmed_at).slice(0, 10),
    helpful_count: Number(row.helpful_count ?? 0),
    created_at: String(row.created_at),
    approved_at: (row.approved_at as string | null) ?? null,
    approved_by: (row.approved_by as string | null) ?? null,
    rejected_reason: (row.rejected_reason as string | null) ?? null,
    error_message: (row.error_message as string | null) ?? null,
    submitted_at: (row.submitted_at as string | null) ?? null,
  };
}

export async function listUploadedVideos(): Promise<Video[]> {
  if (!isSupabaseConfigured()) {
    if (!allowLocalDataStore()) return [];
    return listLocalVideos();
  }
  try {
    const admin = createAdminClient();
    const { data, error } = await admin.from("videos").select("*").order("created_at", {
      ascending: false,
    });
    if (error) {
      console.error("listUploadedVideos", error.message);
      if (!allowLocalDataStore()) return [];
      return listLocalVideos();
    }
    return (data ?? []).map((row) => mapVideo(row as Record<string, unknown>));
  } catch (err) {
    console.error("listUploadedVideos", err);
    if (!allowLocalDataStore()) return [];
    return listLocalVideos();
  }
}

export async function listApprovedVideos(): Promise<Video[]> {
  if (!isSupabaseConfigured()) {
    if (!allowLocalDataStore()) return [];
    return (await listLocalVideos()).filter((v) => v.status === "approved");
  }
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("videos")
      .select("*")
      .eq("status", "approved")
      .order("filmed_at", { ascending: false });
    if (error) {
      console.error("listApprovedVideos", error.message);
      if (!allowLocalDataStore()) return [];
      return (await listLocalVideos()).filter((v) => v.status === "approved");
    }
    return (data ?? []).map((row) => mapVideo(row as Record<string, unknown>));
  } catch (err) {
    console.error("listApprovedVideos", err);
    if (!allowLocalDataStore()) return [];
    return (await listLocalVideos()).filter((v) => v.status === "approved");
  }
}

export async function getVideoById(id: string): Promise<Video | null> {
  if (!isSupabaseConfigured()) return getLocalVideo(id);
  const admin = createAdminClient();
  const { data, error } = await admin.from("videos").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapVideo(data as Record<string, unknown>) : null;
}

export async function findVideoByUploadId(muxUploadId: string): Promise<Video | null> {
  if (!isSupabaseConfigured()) return getLocalVideoByUploadId(muxUploadId);
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("videos")
    .select("*")
    .eq("mux_upload_id", muxUploadId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapVideo(data as Record<string, unknown>) : null;
}

export async function findVideoByAssetId(muxAssetId: string): Promise<Video | null> {
  if (!isSupabaseConfigured()) return getLocalVideoByAssetId(muxAssetId);
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("videos")
    .select("*")
    .eq("mux_asset_id", muxAssetId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapVideo(data as Record<string, unknown>) : null;
}

export async function createUploadVideoBeforeMux(input: {
  userId: string;
  hostelId: string;
  category: VideoCategory;
  filmedAt: string;
}): Promise<Video> {
  const id = randomUUID();
  const base = {
    id,
    user_id: input.userId,
    hostel_id: input.hostelId,
    mux_upload_id: null as string | null,
    mux_asset_id: null as string | null,
    mux_playback_id: null as string | null,
    placeholder_video_url: null as string | null,
    placeholder_poster_url: null as string | null,
    category: input.category,
    caption: null as string | null,
    status: "uploading" as const,
    filmed_at: input.filmedAt,
    approved_at: null as string | null,
    approved_by: null as string | null,
    rejected_reason: null as string | null,
    error_message: null as string | null,
    submitted_at: null as string | null,
  };

  if (!isSupabaseConfigured()) {
    if (!allowLocalDataStore()) {
      throw new Error("Supabase is required for uploads in production.");
    }
    return createLocalVideo(base);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("videos")
    .insert({ ...base, helpful_count: 0 })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return mapVideo(data as Record<string, unknown>);
}

export async function patchVideo(
  id: string,
  patch: Partial<Video>,
): Promise<Video | null> {
  if (!isSupabaseConfigured()) return updateLocalVideo(id, patch);

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("videos")
    .update(patch)
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapVideo(data as Record<string, unknown>) : null;
}

export async function applyWebhookUpdate(input: {
  videoId?: string | null;
  muxUploadId?: string | null;
  muxAssetId?: string | null;
  muxPlaybackId?: string | null;
  status: VideoStatus;
  errorMessage?: string | null;
}): Promise<Video | null> {
  let video: Video | null = null;
  if (input.videoId) video = await getVideoById(input.videoId);
  if (!video && input.muxUploadId) video = await findVideoByUploadId(input.muxUploadId);
  if (!video && input.muxAssetId) video = await findVideoByAssetId(input.muxAssetId);
  if (!video) return null;

  if (!shouldApplyStatus(video.status, input.status) && input.status !== "errored") {
    const idPatch: Partial<Video> = {};
    if (input.muxAssetId && !video.mux_asset_id) idPatch.mux_asset_id = input.muxAssetId;
    if (input.muxPlaybackId && !video.mux_playback_id) {
      idPatch.mux_playback_id = input.muxPlaybackId;
    }
    if (Object.keys(idPatch).length === 0) return video;
    return patchVideo(video.id, idPatch);
  }

  let nextStatus = input.status;
  if (
    input.status === "ready" &&
    video.submitted_at &&
    video.status !== "approved" &&
    video.status !== "rejected" &&
    video.status !== "hidden"
  ) {
    nextStatus = "pending";
  }

  return patchVideo(video.id, {
    mux_asset_id: input.muxAssetId ?? video.mux_asset_id,
    mux_playback_id: input.muxPlaybackId ?? video.mux_playback_id,
    mux_upload_id: input.muxUploadId ?? video.mux_upload_id,
    status: nextStatus,
    error_message: input.errorMessage ?? null,
  });
}

export async function submitVideoMetadata(input: {
  videoId: string;
  userId: string;
  caption: string | null;
  filmedAt: string;
  rating: {
    cleanliness: number;
    sleep: number;
    social: number;
    security: number;
    location: number;
    vibe_score: number;
  };
}): Promise<Video | null> {
  const video = await getVideoById(input.videoId);
  if (!video) return null;
  if (video.user_id !== input.userId) {
    throw new Error("You can only update your own Looksee.");
  }

  const submittedAt = new Date().toISOString();
  let status: VideoStatus = video.status;
  if (video.status === "ready" || video.mux_playback_id) {
    status = "pending";
  } else if (video.status === "uploading") {
    status = "processing";
  }

  const updated = await patchVideo(input.videoId, {
    caption: input.caption,
    filmed_at: input.filmedAt,
    submitted_at: submittedAt,
    status,
  });

  await upsertRatingForVideo({
    userId: input.userId,
    hostelId: video.hostel_id,
    videoId: video.id,
    ...input.rating,
  });

  return updated;
}

async function upsertRatingForVideo(input: {
  userId: string;
  hostelId: string;
  videoId: string;
  cleanliness: number;
  sleep: number;
  social: number;
  security: number;
  location: number;
  vibe_score: number;
}): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("ratings")
    .select("id")
    .eq("user_id", input.userId)
    .eq("video_id", input.videoId)
    .maybeSingle();

  const payload = {
    user_id: input.userId,
    hostel_id: input.hostelId,
    video_id: input.videoId,
    cleanliness: input.cleanliness,
    sleep: input.sleep,
    social: input.social,
    security: input.security,
    location: input.location,
    vibe_score: input.vibe_score,
  };

  if (existing) {
    const { error } = await supabase.from("ratings").update(payload).eq("id", existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("ratings").insert(payload);
    if (error) throw new Error(error.message);
  }
}

export async function approveVideoAsAdmin(
  videoId: string,
  adminId: string,
): Promise<Video> {
  if (!isSupabaseConfigured()) {
    const video = await getVideoById(videoId);
    if (!video?.mux_playback_id) {
      throw new Error("Cannot approve a video without a Mux playback ID yet.");
    }
    if (video.status === "approved") return video;
    const updated = await patchVideo(videoId, {
      status: "approved",
      approved_at: new Date().toISOString(),
      approved_by: adminId,
      error_message: null,
    });
    if (!updated) throw new Error("Video not found");
    return updated;
  }

  const admin = createAdminClient();
  const { data, error } = await admin.rpc("admin_approve_video", {
    p_video_id: videoId,
    p_admin_id: adminId,
  });

  if (error) {
    // Fallback without RPC if migration not applied yet
    const video = await getVideoById(videoId);
    if (!video) throw new Error("Video not found");
    if (video.status === "approved") return video;
    if (!video.mux_playback_id) {
      throw new Error("Cannot approve a video without a Mux playback ID yet.");
    }
    const updated = await patchVideo(videoId, {
      status: "approved",
      approved_at: new Date().toISOString(),
      approved_by: adminId,
      error_message: null,
    });
    if (!updated) throw new Error("Video not found");

    await awardPointsAdmin({
      userId: updated.user_id,
      amount: 100,
      type: "video_approved",
      referenceId: updated.id,
      description: "Hostel video approved",
    });

    const { count } = await admin
      .from("videos")
      .select("id", { count: "exact", head: true })
      .eq("user_id", updated.user_id)
      .eq("status", "approved")
      .neq("id", updated.id);

    if ((count ?? 0) === 0) {
      await awardPointsAdmin({
        userId: updated.user_id,
        amount: 100,
        type: "first_upload_bonus",
        referenceId: updated.id,
        description: "First Looksee bonus",
      });
    }

    await admin.rpc("recalculate_hostel_aggregates", {
      p_hostel_id: updated.hostel_id,
    });

    return updated;
  }

  return mapVideo(data as Record<string, unknown>);
}

export async function rejectVideoAsAdmin(
  videoId: string,
  adminId: string,
  reason?: string,
): Promise<Video> {
  if (!isSupabaseConfigured()) {
    const updated = await patchVideo(videoId, {
      status: "rejected",
      rejected_reason: reason ?? null,
      approved_at: null,
      approved_by: null,
    });
    if (!updated) throw new Error("Video not found");
    return updated;
  }

  const admin = createAdminClient();
  const { data, error } = await admin.rpc("admin_reject_video", {
    p_video_id: videoId,
    p_admin_id: adminId,
    p_reason: reason ?? null,
  });

  if (error) {
    const updated = await patchVideo(videoId, {
      status: "rejected",
      rejected_reason: reason ?? null,
      approved_at: null,
      approved_by: null,
    });
    if (!updated) throw new Error(error.message);
    void adminId;
    return updated;
  }

  return mapVideo(data as Record<string, unknown>);
}

export async function hideVideoAsAdmin(videoId: string): Promise<Video> {
  const updated = await patchVideo(videoId, { status: "hidden" });
  if (!updated) throw new Error("Video not found");
  if (isSupabaseConfigured()) {
    const admin = createAdminClient();
    try {
    await admin.rpc("recalculate_hostel_aggregates", {
      p_hostel_id: updated.hostel_id,
    });
  } catch {
    /* optional if RPC missing */
  }
  }
  return updated;
}

export async function createHostelSuggestion(input: {
  userId: string;
  name: string;
  destination: string;
  notes?: string;
}): Promise<HostelSuggestion> {
  if (!isSupabaseConfigured()) {
    return createLocalSuggestion({
      user_id: input.userId,
      name: input.name,
      destination: input.destination,
      notes: input.notes ?? null,
    });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hostel_suggestions")
    .insert({
      user_id: input.userId,
      name: input.name,
      destination: input.destination,
      notes: input.notes ?? null,
      status: "pending",
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as HostelSuggestion;
}

export async function listVideosForUser(userId: string): Promise<Video[]> {
  if (!isSupabaseConfigured()) {
    return (await listLocalVideos()).filter((v) => v.user_id === userId);
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapVideo(row as Record<string, unknown>));
}

export async function getApprovedRatingsForHostel(hostelId: string): Promise<Rating[]> {
  if (!isSupabaseConfigured()) return [];
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("ratings")
    .select("*, videos!inner(status)")
    .eq("hostel_id", hostelId)
    .eq("videos.status", "approved");
  if (error) {
    // Fallback without join
    const { data: ratings } = await admin.from("ratings").select("*").eq("hostel_id", hostelId);
    const { data: videos } = await admin
      .from("videos")
      .select("id")
      .eq("hostel_id", hostelId)
      .eq("status", "approved");
    const approvedIds = new Set((videos ?? []).map((v) => v.id as string));
    return ((ratings ?? []) as Rating[]).filter(
      (r) => r.video_id && approvedIds.has(r.video_id),
    );
  }
  return (data ?? []) as Rating[];
}
