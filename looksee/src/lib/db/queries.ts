import {
  seedDestinations,
  seedHostelsWithCounts,
  seedProfiles,
  seedRatings,
  seedVideos,
} from "@/lib/seed/data";
import { listApprovedVideos, listUploadedVideos } from "@/lib/db/videos";
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

function hostelMap(): Map<string, Hostel> {
  return new Map(seedHostelsWithCounts.map((h) => [h.id, h]));
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

function toVideoCard(video: Video): VideoCard | null {
  const hostel = hostelMap().get(video.hostel_id);
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

async function mostRecentFilmedAt(hostelId: string): Promise<string | null> {
  const dates = (await approvedVideos())
    .filter((v) => v.hostel_id === hostelId)
    .map((v) => v.filmed_at)
    .sort()
    .reverse();
  return dates[0] ?? null;
}

async function approvedCountForHostel(hostelId: string): Promise<number> {
  return (await approvedVideos()).filter((v) => v.hostel_id === hostelId).length;
}

async function toHostelCard(hostel: Hostel): Promise<HostelCard | null> {
  const destination = destinationMap().get(hostel.destination_id);
  if (!destination) return null;
  const videoCount = await approvedCountForHostel(hostel.id);
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
    most_recent_filmed_at: await mostRecentFilmedAt(hostel.id),
  };
}

async function recentLookseeCount(destinationId: string, withinDays = 30): Promise<number> {
  const hostelIds = new Set(
    seedHostelsWithCounts.filter((h) => h.destination_id === destinationId).map((h) => h.id),
  );
  const now = new Date();
  return (await approvedVideos()).filter((v) => {
    if (!hostelIds.has(v.hostel_id)) return false;
    return differenceInCalendarDays(now, parseISO(v.filmed_at)) <= withinDays;
  }).length;
}

export async function getTrendingDestinations(): Promise<DestinationCard[]> {
  const destinations = seedDestinations.filter((d) => d.active);
  return Promise.all(
    destinations.map(async (d) => ({
      id: d.id,
      name: d.name,
      slug: d.slug,
      country: d.country,
      hero_image_url: d.hero_image_url,
      hostel_count: seedHostelsWithCounts.filter((h) => h.destination_id === d.id && h.active)
        .length,
      recent_looksee_count: await recentLookseeCount(d.id),
    })),
  );
}

export async function getRecentVideos(limit = 12): Promise<VideoCard[]> {
  return (await approvedVideos())
    .sort((a, b) => (a.filmed_at < b.filmed_at ? 1 : -1))
    .slice(0, limit)
    .map(toVideoCard)
    .filter((v): v is VideoCard => v !== null);
}

export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  return seedDestinations.find((d) => d.slug === slug && d.active) ?? null;
}

export async function getHostelsByDestination(destinationId: string): Promise<HostelCard[]> {
  const hostels = seedHostelsWithCounts.filter(
    (h) => h.destination_id === destinationId && h.active,
  );
  const cards = await Promise.all(hostels.map(toHostelCard));
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
  return (await approvedVideos())
    .filter((v) => {
      if (v.hostel_id !== hostelId) return false;
      if (category && category !== "all" && v.category !== category) return false;
      return true;
    })
    .sort((a, b) => (a.filmed_at < b.filmed_at ? 1 : -1))
    .map(toVideoCard)
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

  const cards = await Promise.all(results.map(toHostelCard));
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
