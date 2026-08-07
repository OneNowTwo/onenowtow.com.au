import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { HostelSuggestion, Video, VideoStatus } from "@/lib/types/database";
import { allowLocalDataStore, isSupabaseConfigured } from "@/lib/env";

type LocalStore = {
  videos: Video[];
  suggestions: HostelSuggestion[];
};

const STORE_PATH = path.join(process.cwd(), ".data", "uploads.json");

function assertLocalStoreAllowed(): void {
  if (!allowLocalDataStore()) {
    throw new Error(
      "Local .data store is disabled on Vercel/production. Configure Supabase env vars.",
    );
  }
}

async function ensureStore(): Promise<LocalStore> {
  assertLocalStoreAllowed();
  try {
    const raw = await readFile(STORE_PATH, "utf8");
    return JSON.parse(raw) as LocalStore;
  } catch {
    const empty: LocalStore = { videos: [], suggestions: [] };
    await mkdir(path.dirname(STORE_PATH), { recursive: true });
    await writeFile(STORE_PATH, JSON.stringify(empty, null, 2), "utf8");
    return empty;
  }
}

async function saveStore(store: LocalStore): Promise<void> {
  await mkdir(path.dirname(STORE_PATH), { recursive: true });
  await writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

/**
 * Local JSON persistence for Mux upload metadata when Supabase is not configured.
 * Phase 4+ should prefer Supabase; keep this behind the repository layer.
 */
export async function listLocalVideos(): Promise<Video[]> {
  const store = await ensureStore();
  return store.videos;
}

export async function getLocalVideo(id: string): Promise<Video | null> {
  const store = await ensureStore();
  return store.videos.find((v) => v.id === id) ?? null;
}

export async function getLocalVideoByUploadId(
  muxUploadId: string,
): Promise<Video | null> {
  const store = await ensureStore();
  return store.videos.find((v) => v.mux_upload_id === muxUploadId) ?? null;
}

export async function getLocalVideoByAssetId(
  muxAssetId: string,
): Promise<Video | null> {
  const store = await ensureStore();
  return store.videos.find((v) => v.mux_asset_id === muxAssetId) ?? null;
}

export async function createLocalVideo(
  input: Omit<Video, "id" | "created_at" | "helpful_count"> & { id?: string },
): Promise<Video> {
  const store = await ensureStore();
  const video: Video = {
    ...input,
    id: input.id ?? randomUUID(),
    helpful_count: 0,
    created_at: new Date().toISOString(),
  };
  store.videos.unshift(video);
  await saveStore(store);
  return video;
}

export async function updateLocalVideo(
  id: string,
  patch: Partial<Video>,
): Promise<Video | null> {
  const store = await ensureStore();
  const index = store.videos.findIndex((v) => v.id === id);
  if (index === -1) return null;

  const current = store.videos[index];
  const next = { ...current, ...patch, id: current.id };
  store.videos[index] = next;
  await saveStore(store);
  return next;
}

export async function createLocalSuggestion(
  input: Omit<HostelSuggestion, "id" | "created_at" | "status"> & {
    status?: HostelSuggestion["status"];
  },
): Promise<HostelSuggestion> {
  const store = await ensureStore();
  const suggestion: HostelSuggestion = {
    id: randomUUID(),
    user_id: input.user_id,
    name: input.name,
    destination: input.destination,
    notes: input.notes ?? null,
    status: input.status ?? "pending",
    created_at: new Date().toISOString(),
  };
  store.suggestions.unshift(suggestion);
  await saveStore(store);
  return suggestion;
}

export function usingLocalVideoStore(): boolean {
  return allowLocalDataStore() && !isSupabaseConfigured();
}

/** Idempotent status transition helper for webhooks. */
export function shouldApplyStatus(
  current: VideoStatus,
  next: VideoStatus,
): boolean {
  if (current === next) return false;
  if (current === "approved" || current === "rejected" || current === "hidden") return false;
  if (next === "errored") return true;
  if (next === "pending") {
    return current === "ready" || current === "processing" || current === "uploading";
  }

  const order: VideoStatus[] = [
    "uploading",
    "processing",
    "ready",
    "pending",
    "errored",
  ];

  const currentIdx = order.indexOf(current);
  const nextIdx = order.indexOf(next);
  if (currentIdx === -1 || nextIdx === -1) return true;
  return nextIdx >= currentIdx;
}
