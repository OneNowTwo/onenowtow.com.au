import {
  seedDestinations,
  seedHostelsWithCounts,
  seedProfiles,
  seedRatings,
  seedVideos,
} from "@/lib/seed/data";
import { listApprovedVideos, listUploadedVideos } from "@/lib/db/videos";
import { hostelsByAnyId } from "@/lib/db/hostels";
import { videoBelongsToHostel } from "@/lib/db/hostel-ids";
import { thumbnailUrl } from "@/lib/mux/client";
import type { Destination, Hostel, Profile, Rating, Video } from "@/lib/types/database";
import type { DestinationCard, HostelCard, VideoCard } from "@/lib/types/views";
import type { SearchFilter } from "@/lib/constants";
import { differenceInCalendarDays, parseISO } from "date-fns";

function profileMap(): Map<string, Profile> {
  return new Map(seedProfiles.map((p) => [p.id, p]));
}

function destinationMap(): Map<string, Destination> {
  return new Map(seedDestinations.map((d) => [d.id, d]));
}

async function approvedVideos(): Promise<Video[]> {
  const uploaded = await listApprovedVideos().catch(() => listUploadedVideos());
  const byId = new Map<string, Video>();
  for (const video of seedVideos.filter((v) => v.status === "approved")) {
    byId.set(video.id, video);
  }
  for (const video of uploaded) {
    if (video.status === "approved") byId.set(video.id, video);
  }
  return Array.from(byId.values());
}

async function browseContext(): Promise<{
  videos: Video[];
  lookup: Map<string, Hostel>;
}> {
  const [videos, lookup] = await Promise.all([approvedVideos(), hostelsByAnyId()]);
  return { videos, lookup };
}

function toVideoCard(video: Video, lookup: Map<string, Hostel>): VideoCard | null {
  const hostel = lookup.get(video.hostel_id);
  const contributor = profileMap().get(video.user_id) ?? {
    first_name: "Traveller",
    avatar_url: null,
  };
  if (!hostel) return null;
  const destination = destinationMap().get(hostel.destination_id);
  if (!destination) return null;

  const poster =
    video.placeholder_poster_url ??
    (video.mux_playback_id ? thumbnailUrl(video.mux_playback_id) : null) ??
    hostel.hero_image_url;

  return {
    id: video.id,
    category: video.category,
    caption: video.caption,
    filmed_at: video.filmed_at,
    helpful_count: video.helpful_count,
    mux_playback_id: video.mux_playback_id,
    placeholder_video_url: video.placeholder_video_url,
    placeholder_poster_url: poster,
    hostel_id: hostel.id,
    hostel_name: hostel.name,
    hostel_slug: hostel.slug,
    destination_name: destination.name,
    destination_slug: destination.slug,
    contributor_first_name: contributor.first_name ?? "Traveller",
    contributor_avatar_url: contributor.avatar_url,
    user_id: video.user_id,
  };
}

function mostRecentFilmedAt(
  videos: Video[],
  seedHostel: Hostel,
  lookup: Map<string, Hostel>,
): string | null {
  const dates = videos
    .filter((v) => videoBelongsToHostel(v.hostel_id, seedHostel, lookup))
    .map((v) => v.filmed_at)
    .sort()
    .reverse();
  return dates[0] ?? null;
}

function approvedCountForHostel(
  videos: Video[],
  seedHostel: Hostel,
  lookup: Map<string, Hostel>,
): number {
  return videos.filter((v) => videoBelongsToHostel(v.hostel_id, seedHostel, lookup)).length;
}

async function toHostelCard(
  hostel: Hostel,
  videos: Video[],
  lookup: Map<string, Hostel>,
): Promise<HostelCard | null> {
  const destination = destinationMap().get(hostel.destination_id);
  if (!destination) return null;
  const videoCount = approvedCountForHostel(videos, hostel, lookup);
  return {
    id: hostel.id,
    name: hostel.name,
    slug: hostel.slug,
    destination_name: destination.name,
    destination_slug: destination.slug,
    hero_image_url: hostel.hero_image_url,
    avg_overall: hostel.avg_overall,
    avg_vibe_score: hostel.avg_vibe_score,
    video_count: videoCount || hostel.video_count,
    price_from_aud: hostel.price_from_aud,
    most_recent_filmed_at: mostRecentFilmedAt(videos, hostel, lookup),
  };
}

function recentLookseeCount(
  videos: Video[],
  lookup: Map<string, Hostel>,
  destinationId: string,
  withinDays = 30,
): number {
  const now = new Date();
  return videos.filter((v) => {
    const hostel = lookup.get(v.hostel_id);
    if (!hostel || hostel.destination_id !== destinationId) return false;
    return differenceInCalendarDays(now, parseISO(v.filmed_at)) <= withinDays;
  }).length;
}

export async function getTrendingDestinations(): Promise<DestinationCard[]> {
  const { videos, lookup } = await browseContext();
  const destinations = seedDestinations.filter((d) => d.active);
  return destinations.map((d) => ({
    id: d.id,
    name: d.name,
    slug: d.slug,
    country: d.country,
    hero_image_url: d.hero_image_url,
    hostel_count: seedHostelsWithCounts.filter((h) => h.destination_id === d.id && h.active)
      .length,
    recent_looksee_count: recentLookseeCount(videos, lookup, d.id),
  }));
}

export async function getRecentVideos(limit = 12): Promise<VideoCard[]> {
  const { videos, lookup } = await browseContext();
  return videos
    .sort((a, b) => {
      const muxDelta = Number(Boolean(b.mux_playback_id)) - Number(Boolean(a.mux_playback_id));
      if (muxDelta !== 0) return muxDelta;
      return a.filmed_at < b.filmed_at ? 1 : -1;
    })
    .map((video) => toVideoCard(video, lookup))
    .filter((v): v is VideoCard => v !== null)
    .slice(0, limit);
}

export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  return seedDestinations.find((d) => d.slug === slug && d.active) ?? null;
}

export async function getHostelsByDestination(destinationId: string): Promise<HostelCard[]> {
  const { videos, lookup } = await browseContext();
  const hostels = seedHostelsWithCounts.filter(
    (h) => h.destination_id === destinationId && h.active,
  );
  const cards = await Promise.all(hostels.map((hostel) => toHostelCard(hostel, videos, lookup)));
  return cards
    .filter((h): h is HostelCard => h !== null)
    .sort((a, b) => (b.avg_overall ?? 0) - (a.avg_overall ?? 0));
}

export async function getHostelBySlug(slug: string): Promise<Hostel | null> {
  return seedHostelsWithCounts.find((h) => h.slug === slug && h.active) ?? null;
}

export async function getDestinationById(id: string): Promise<Destination | null> {
  return seedDestinations.find((d) => d.id === id) ?? null;
}

export async function getVideosForHostel(
  hostelId: string,
  category?: string,
): Promise<VideoCard[]> {
  const { videos, lookup } = await browseContext();
  const seedHostel = lookup.get(hostelId) ?? seedHostelsWithCounts.find((h) => h.id === hostelId);
  if (!seedHostel) return [];

  return videos
    .filter((v) => {
      if (!videoBelongsToHostel(v.hostel_id, seedHostel, lookup)) return false;
      if (category && category !== "all" && v.category !== category) return false;
      return true;
    })
    .sort((a, b) => {
      const muxDelta = Number(Boolean(b.mux_playback_id)) - Number(Boolean(a.mux_playback_id));
      if (muxDelta !== 0) return muxDelta;
      return a.filmed_at < b.filmed_at ? 1 : -1;
    })
    .map((video) => toVideoCard(video, lookup))
    .filter((v): v is VideoCard => v !== null);
}

export async function getRatingsForHostel(hostelId: string): Promise<Rating[]> {
  return seedRatings.filter((r) => r.hostel_id === hostelId);
}

export async function searchHostels(
  query: string,
  filters: SearchFilter[] = [],
): Promise<HostelCard[]> {
  const q = query.trim().toLowerCase();
  const destinations = destinationMap();
  const { videos, lookup } = await browseContext();

  let results = seedHostelsWithCounts.filter((h) => {
    if (!h.active) return false;
    if (!q) return true;
    const dest = destinations.get(h.destination_id);
    return (
      h.name.toLowerCase().includes(q) ||
      dest?.name.toLowerCase().includes(q) ||
      dest?.slug.includes(q) ||
      h.slug.includes(q)
    );
  });

  for (const filter of filters) {
    results = results.filter((h) => {
      const vibe = h.avg_vibe_score ?? 50;
      switch (filter) {
        case "party":
          return vibe <= 20;
        case "social":
          return vibe > 20 && vibe <= 40;
        case "chill":
          return vibe > 60 && vibe <= 80;
        case "quiet":
          return vibe > 80;
        case "highly_rated":
          return (h.avg_overall ?? 0) >= 4.2;
        case "recently_reviewed":
          return true;
        case "private_rooms":
        case "dorms":
          return true;
        default:
          return true;
      }
    });
  }

  const cards = await Promise.all(results.map((hostel) => toHostelCard(hostel, videos, lookup)));
  let filtered = cards.filter((h): h is HostelCard => h !== null);

  if (filters.includes("recently_reviewed")) {
    filtered = filtered.filter((h) => {
      if (!h.most_recent_filmed_at) return false;
      return differenceInCalendarDays(new Date(), parseISO(h.most_recent_filmed_at)) <= 14;
    });
  }

  return filtered.sort((a, b) => (b.avg_overall ?? 0) - (a.avg_overall ?? 0));
}

export async function getProfile(id: string): Promise<Profile | null> {
  return seedProfiles.find((p) => p.id === id) ?? null;
}

export async function searchHostelsForUpload(query: string) {
  const cards = await searchHostels(query);
  return cards.slice(0, 20);
}
