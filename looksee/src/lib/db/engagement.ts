import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";
import type { SavedHostel } from "@/lib/types/database";

export async function listSavedHostelIds(userId: string): Promise<string[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("saved_hostels")
    .select("hostel_id")
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => row.hostel_id as string);
}

export async function listSavedHostels(userId: string): Promise<SavedHostel[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("saved_hostels")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as SavedHostel[];
}

export async function saveHostel(userId: string, hostelId: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is required to save hostels.");
  }
  const supabase = await createClient();
  const { error } = await supabase.from("saved_hostels").insert({
    user_id: userId,
    hostel_id: hostelId,
  });
  if (error && error.code !== "23505") throw new Error(error.message);
}

export async function unsaveHostel(userId: string, hostelId: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is required to unsave hostels.");
  }
  const supabase = await createClient();
  const { error } = await supabase
    .from("saved_hostels")
    .delete()
    .eq("user_id", userId)
    .eq("hostel_id", hostelId);
  if (error) throw new Error(error.message);
}

export async function isHostelSaved(userId: string, hostelId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const supabase = await createClient();
  const { data } = await supabase
    .from("saved_hostels")
    .select("id")
    .eq("user_id", userId)
    .eq("hostel_id", hostelId)
    .maybeSingle();
  return Boolean(data);
}

export async function toggleHelpful(
  userId: string,
  videoId: string,
): Promise<{ helpful: boolean; count: number }> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is required for Helpful votes.");
  }

  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: video } = await admin
    .from("videos")
    .select("id, user_id, status, helpful_count")
    .eq("id", videoId)
    .maybeSingle();

  if (!video) throw new Error("Video not found");
  if (video.status !== "approved") {
    throw new Error("Only approved Looksees can be marked helpful.");
  }
  if (video.user_id === userId) {
    throw new Error("You can’t mark your own Looksee helpful.");
  }

  const { data: existing } = await supabase
    .from("helpful_votes")
    .select("id")
    .eq("user_id", userId)
    .eq("video_id", videoId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase.from("helpful_votes").delete().eq("id", existing.id);
    if (error) throw new Error(error.message);
    const { data: refreshed } = await admin
      .from("videos")
      .select("helpful_count")
      .eq("id", videoId)
      .single();
    return { helpful: false, count: Number(refreshed?.helpful_count ?? 0) };
  }

  const { error } = await supabase.from("helpful_votes").insert({
    user_id: userId,
    video_id: videoId,
  });
  if (error) throw new Error(error.message);

  const { data: refreshed } = await admin
    .from("videos")
    .select("helpful_count")
    .eq("id", videoId)
    .single();

  return { helpful: true, count: Number(refreshed?.helpful_count ?? 0) };
}

export async function userHasHelpful(userId: string, videoId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const supabase = await createClient();
  const { data } = await supabase
    .from("helpful_votes")
    .select("id")
    .eq("user_id", userId)
    .eq("video_id", videoId)
    .maybeSingle();
  return Boolean(data);
}

export async function createReport(input: {
  userId: string;
  videoId: string;
  reason:
    | "inaccurate_misleading"
    | "offensive"
    | "privacy"
    | "commercial_promotional"
    | "wrong_hostel"
    | "other";
  details?: string;
}): Promise<void> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is required to report videos.");
  }
  const supabase = await createClient();
  const { error } = await supabase.from("video_reports").insert({
    video_id: input.videoId,
    reporter_id: input.userId,
    reason: input.reason,
    details: input.details ?? null,
    status: "open",
  });
  if (error) {
    if (error.code === "23505") {
      throw new Error("You’ve already reported this Looksee for that reason.");
    }
    throw new Error(error.message);
  }
}
