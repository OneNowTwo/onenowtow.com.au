import { z } from "zod";

export const videoCategories = [
  "dorm",
  "bed",
  "bathroom",
  "kitchen",
  "common_area",
  "social_nightlife",
  "private_room",
  "other",
] as const;

export const createUploadSchema = z.object({
  hostelId: z.string().min(8, "Choose a hostel"),
  category: z.enum(videoCategories),
  filmedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Filmed date must be YYYY-MM-DD")
    .optional(),
});

export const submitMetadataSchema = z.object({
  videoId: z.string().min(8),
  caption: z
    .string()
    .trim()
    .max(180, "Caption must be 180 characters or fewer")
    .optional()
    .nullable(),
  filmedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Filmed date must be YYYY-MM-DD"),
});

export const suggestHostelSchema = z.object({
  name: z.string().trim().min(2).max(120),
  destination: z.string().trim().min(2).max(120),
  notes: z.string().trim().max(500).optional(),
});

export const approveVideoSchema = z.object({
  videoId: z.string().min(8),
});

export const MAX_VIDEO_SECONDS = 90;
export const TARGET_VIDEO_MIN_SECONDS = 15;
export const TARGET_VIDEO_MAX_SECONDS = 60;

export const ACCEPTED_VIDEO_MIME_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/x-m4v",
  "video/3gpp",
  "video/3gpp2",
] as const;
