export type DestinationCard = {
  id: string;
  name: string;
  slug: string;
  country: string;
  hero_image_url: string | null;
  hostel_count: number;
  recent_looksee_count: number;
};

export type HostelCard = {
  id: string;
  name: string;
  slug: string;
  destination_name: string;
  destination_slug: string;
  hero_image_url: string | null;
  avg_overall: number | null;
  avg_vibe_score: number | null;
  video_count: number;
  price_from_aud: number | null;
  most_recent_filmed_at: string | null;
};

export type VideoCard = {
  id: string;
  category: string;
  caption: string | null;
  filmed_at: string;
  helpful_count: number;
  mux_playback_id: string | null;
  placeholder_video_url: string | null;
  placeholder_poster_url: string | null;
  hostel_id: string;
  hostel_name: string;
  hostel_slug: string;
  destination_name: string;
  destination_slug: string;
  contributor_first_name: string;
  contributor_avatar_url: string | null;
  user_id: string;
};
