export type UserRole = "traveller" | "admin";

export type VideoStatus =
  | "uploading"
  | "processing"
  | "ready"
  | "pending"
  | "approved"
  | "rejected"
  | "errored"
  | "hidden";


export type VideoCategory =
  | "dorm"
  | "bed"
  | "bathroom"
  | "kitchen"
  | "common_area"
  | "social_nightlife"
  | "private_room"
  | "other";

export type SuggestionStatus = "pending" | "approved" | "rejected";

export type ReportReason =
  | "inaccurate_misleading"
  | "offensive"
  | "privacy"
  | "commercial_promotional"
  | "wrong_hostel"
  | "other";

export type ReportStatus = "open" | "reviewed" | "dismissed" | "actioned";

export type PointsType =
  | "video_approved"
  | "helpful_10"
  | "helpful_50"
  | "first_upload_bonus"
  | "admin_adjustment"
  | "redemption";

export interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  avatar_url: string | null;
  nationality: string | null;
  current_city: string | null;
  role: UserRole;
  points_balance: number;
  created_at: string;
  updated_at: string;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  country: string;
  description: string | null;
  hero_image_url: string | null;
  latitude: number | null;
  longitude: number | null;
  active: boolean;
  created_at: string;
}

export interface Hostel {
  id: string;
  destination_id: string;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  hero_image_url: string | null;
  hostelworld_url: string | null;
  booking_url: string | null;
  direct_url: string | null;
  preferred_booking_url: string | null;
  price_from_aud: number | null;
  active: boolean;
  avg_cleanliness: number | null;
  avg_sleep: number | null;
  avg_social: number | null;
  avg_security: number | null;
  avg_location: number | null;
  avg_overall: number | null;
  avg_vibe_score: number | null;
  video_count: number;
  created_at: string;
  updated_at: string;
}

export interface Video {
  id: string;
  user_id: string;
  hostel_id: string;
  mux_upload_id: string | null;
  mux_asset_id: string | null;
  mux_playback_id: string | null;
  placeholder_video_url: string | null;
  placeholder_poster_url: string | null;
  category: VideoCategory;
  caption: string | null;
  status: VideoStatus;
  filmed_at: string;
  helpful_count: number;
  created_at: string;
  approved_at: string | null;
  approved_by: string | null;
  rejected_reason: string | null;
  error_message: string | null;
  submitted_at: string | null;
}

export interface Rating {
  id: string;
  user_id: string;
  hostel_id: string;
  video_id: string | null;
  cleanliness: number;
  sleep: number;
  social: number;
  security: number;
  location: number;
  vibe_score: number;
  created_at: string;
}

export interface HelpfulVote {
  id: string;
  user_id: string;
  video_id: string;
  created_at: string;
}

export interface SavedHostel {
  id: string;
  user_id: string;
  hostel_id: string;
  created_at: string;
}

export interface PointsTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: PointsType;
  reference_id: string | null;
  description: string;
  created_at: string;
}

export interface HostelSuggestion {
  id: string;
  user_id: string;
  name: string;
  destination: string;
  notes: string | null;
  status: SuggestionStatus;
  created_at: string;
}

export interface VideoReport {
  id: string;
  video_id: string;
  reporter_id: string;
  reason: ReportReason;
  details: string | null;
  status: ReportStatus;
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile> & Pick<Profile, "id" | "email">; Update: Partial<Profile> };
      destinations: { Row: Destination; Insert: Omit<Destination, "id" | "created_at"> & { id?: string; created_at?: string }; Update: Partial<Destination> };
      hostels: { Row: Hostel; Insert: Omit<Hostel, "id" | "created_at" | "updated_at" | "video_count"> & { id?: string }; Update: Partial<Hostel> };
      videos: { Row: Video; Insert: Omit<Video, "id" | "created_at" | "helpful_count" | "approved_at" | "approved_by" | "rejected_reason"> & { id?: string }; Update: Partial<Video> };
      ratings: { Row: Rating; Insert: Omit<Rating, "id" | "created_at"> & { id?: string }; Update: Partial<Rating> };
      helpful_votes: { Row: HelpfulVote; Insert: Omit<HelpfulVote, "id" | "created_at"> & { id?: string }; Update: Partial<HelpfulVote> };
      saved_hostels: { Row: SavedHostel; Insert: Omit<SavedHostel, "id" | "created_at"> & { id?: string }; Update: Partial<SavedHostel> };
      points_transactions: { Row: PointsTransaction; Insert: Omit<PointsTransaction, "id" | "created_at"> & { id?: string }; Update: Partial<PointsTransaction> };
      hostel_suggestions: { Row: HostelSuggestion; Insert: Omit<HostelSuggestion, "id" | "created_at" | "status"> & { id?: string; status?: SuggestionStatus }; Update: Partial<HostelSuggestion> };
      video_reports: { Row: VideoReport; Insert: Omit<VideoReport, "id" | "created_at" | "status" | "reviewed_at" | "reviewed_by"> & { id?: string }; Update: Partial<VideoReport> };
    };
  };
}
