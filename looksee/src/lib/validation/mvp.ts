import { z } from "zod";
import { videoCategories } from "@/lib/validation/upload";

export const ratingSchema = z.object({
  cleanliness: z.number().int().min(1).max(5),
  sleep: z.number().int().min(1).max(5),
  social: z.number().int().min(1).max(5),
  security: z.number().int().min(1).max(5),
  location: z.number().int().min(1).max(5),
  vibe_score: z.number().int().min(0).max(100),
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
  rating: ratingSchema,
});

export const createUploadSchema = z.object({
  hostelId: z.string().min(8, "Choose a hostel"),
  category: z.enum(videoCategories),
  filmedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Filmed date must be YYYY-MM-DD")
    .optional(),
});

export const suggestHostelSchema = z.object({
  name: z.string().trim().min(2).max(120),
  destination: z.string().trim().min(2).max(120),
  notes: z.string().trim().max(500).optional(),
});

export const approveVideoSchema = z.object({
  videoId: z.string().min(8),
  reason: z.string().trim().max(500).optional(),
});

export const helpfulSchema = z.object({
  videoId: z.string().min(8),
});

export const saveHostelSchema = z.object({
  hostelId: z.string().min(8),
});

export const reportSchema = z.object({
  videoId: z.string().min(8),
  reason: z.enum([
    "inaccurate_misleading",
    "offensive",
    "privacy",
    "commercial_promotional",
    "wrong_hostel",
    "other",
  ]),
  details: z.string().trim().max(500).optional(),
});

export const profileUpdateSchema = z.object({
  first_name: z.string().trim().min(1).max(80).optional(),
  avatar_url: z.string().url().optional().nullable(),
  nationality: z.string().trim().max(80).optional().nullable(),
  current_city: z.string().trim().max(80).optional().nullable(),
});

export const hostelAdminSchema = z.object({
  id: z.string().min(8).optional(),
  destination_id: z.string().min(8),
  name: z.string().trim().min(2).max(160),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(160)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, hyphens"),
  description: z.string().trim().max(2000).optional().nullable(),
  address: z.string().trim().max(300).optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  hero_image_url: z.string().url().optional().nullable(),
  hostelworld_url: z.string().url().optional().nullable(),
  booking_url: z.string().url().optional().nullable(),
  direct_url: z.string().url().optional().nullable(),
  preferred_booking_url: z.string().url().optional().nullable(),
  price_from_aud: z.number().int().min(0).optional().nullable(),
  active: z.boolean().optional(),
});

export {
  MAX_VIDEO_SECONDS,
  TARGET_VIDEO_MIN_SECONDS,
  TARGET_VIDEO_MAX_SECONDS,
  ACCEPTED_VIDEO_MIME_TYPES,
  videoCategories,
} from "@/lib/validation/upload";
