#!/usr/bin/env node
/**
 * Repair stuck processing/uploading videos by syncing from Mux into Supabase.
 * Requires MUX_TOKEN_ID + MUX_TOKEN_SECRET in .env.local (or env).
 */
import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import Mux from "@mux/mux-node";

function loadEnv() {
  const env = Object.fromEntries(
    readFileSync(".env.local", "utf8")
      .split("\n")
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const i = line.indexOf("=");
        return [line.slice(0, i), line.slice(i + 1)];
      }),
  );
  for (const [key, value] of Object.entries(process.env)) {
    if (value) env[key] = value;
  }
  return env;
}

function mapMuxAssetStatus(status) {
  if (status === "ready") return "ready";
  if (status === "errored") return "errored";
  return "processing";
}

function pickPlaybackId(playbackIds) {
  return (
    playbackIds?.find((p) => p.policy === "public")?.id ?? playbackIds?.[0]?.id ?? null
  );
}

async function findAsset(mux, uploadId, videoId) {
  for await (const asset of mux.video.assets.list({ upload_id: uploadId, limit: 5 })) {
    return asset;
  }
  for await (const asset of mux.video.assets.list({ limit: 100 })) {
    if (asset.passthrough === videoId) return asset;
  }
  return null;
}

async function syncVideo(mux, admin, video) {
  const upload = await mux.video.uploads.retrieve(video.mux_upload_id);
  let assetId = upload.asset_id ?? video.mux_asset_id ?? null;
  let asset = null;

  if (assetId) {
    asset = await mux.video.assets.retrieve(assetId);
  } else {
    asset = await findAsset(mux, video.mux_upload_id, video.id);
    assetId = asset?.id ?? null;
  }

  if (!assetId || !asset) {
    console.log("  no asset yet for", video.id);
    return;
  }

  let status = mapMuxAssetStatus(asset.status);
  if (status === "ready" && video.submitted_at) status = "pending";

  const patch = {
    mux_upload_id: video.mux_upload_id,
    mux_asset_id: assetId,
    mux_playback_id: pickPlaybackId(asset.playback_ids),
    status,
    error_message: null,
  };

  const { data, error } = await admin
    .from("videos")
    .update(patch)
    .eq("id", video.id)
    .select("id,status,mux_asset_id,mux_playback_id")
    .single();

  if (error) throw new Error(error.message);
  console.log("  updated", data);
}

const env = loadEnv();
if (!env.MUX_TOKEN_ID?.trim() || !env.MUX_TOKEN_SECRET?.trim()) {
  console.error("Set MUX_TOKEN_ID and MUX_TOKEN_SECRET in .env.local first.");
  process.exit(1);
}

const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const mux = new Mux({
  tokenId: env.MUX_TOKEN_ID.trim(),
  tokenSecret: env.MUX_TOKEN_SECRET.trim(),
});

const { data: videos, error } = await admin
  .from("videos")
  .select("*")
  .in("status", ["processing", "uploading"])
  .not("mux_upload_id", "is", null);

if (error) throw new Error(error.message);

console.log(`Syncing ${videos?.length ?? 0} stuck video(s)...`);
for (const video of videos ?? []) {
  console.log("\nvideo", video.id, "status", video.status);
  try {
    await syncVideo(mux, admin, video);
  } catch (err) {
    console.error("  error:", err instanceof Error ? err.message : err);
  }
}
