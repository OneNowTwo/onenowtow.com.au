import type { VideoCategory } from "@/lib/types/database";

export const VIDEO_CATEGORY_FILTERS: Array<{
  value: VideoCategory | "all";
  label: string;
}> = [
  { value: "all", label: "All" },
  { value: "dorm", label: "Dorm" },
  { value: "bed", label: "Bed" },
  { value: "bathroom", label: "Bathroom" },
  { value: "kitchen", label: "Kitchen" },
  { value: "common_area", label: "Common area" },
  { value: "social_nightlife", label: "Social/nightlife" },
  { value: "private_room", label: "Private room" },
];

export const SEARCH_FILTERS = [
  "party",
  "social",
  "chill",
  "quiet",
  "private_rooms",
  "dorms",
  "highly_rated",
  "recently_reviewed",
] as const;

export type SearchFilter = (typeof SEARCH_FILTERS)[number];

export const SEARCH_FILTER_LABELS: Record<SearchFilter, string> = {
  party: "Party",
  social: "Social",
  chill: "Chill",
  quiet: "Quiet",
  private_rooms: "Private rooms",
  dorms: "Dorms",
  highly_rated: "Highly rated",
  recently_reviewed: "Recently reviewed",
};
