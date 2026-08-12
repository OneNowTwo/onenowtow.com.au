import { differenceInCalendarDays, parseISO, subDays } from "date-fns";
import type { VideoCategory } from "@/lib/types/database";

export const UPLOAD_LIMITS = {
  perDay: 3,
  openQueue: 5,
  perHostel: 3,
  perHostelDays: 14,
  filmedWithinDays: 14,
} as const;

const OPEN_STATUSES = new Set(["uploading", "processing", "ready", "pending"]);
const COUNTED_STATUSES = new Set([
  "uploading",
  "processing",
  "ready",
  "pending",
  "approved",
]);

export type UploadLimitVideo = {
  user_id: string;
  hostel_id: string;
  category: string;
  status: string;
  created_at: string;
};

export class UploadLimitError extends Error {
  status: number;

  constructor(message: string, status = 429) {
    super(message);
    this.name = "UploadLimitError";
    this.status = status;
  }
}

export function isoDateDaysAgo(days: number, now = new Date()): string {
  return subDays(now, days).toISOString().slice(0, 10);
}

export function filmedAtLimitError(filmedAt: string, now = new Date()): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(filmedAt)) {
    return "Filmed date must be YYYY-MM-DD.";
  }

  const filmed = parseISO(filmedAt);
  const today = parseISO(now.toISOString().slice(0, 10));
  const age = differenceInCalendarDays(today, filmed);

  if (age < 0) return "Filmed date can’t be in the future.";
  if (age > UPLOAD_LIMITS.filmedWithinDays) {
    return `Looksees need to be filmed in the last ${UPLOAD_LIMITS.filmedWithinDays} days — that’s the point.`;
  }
  return null;
}

function isSameUtcDay(iso: string, now: Date): boolean {
  return iso.slice(0, 10) === now.toISOString().slice(0, 10);
}

function inRecentWindow(iso: string, days: number, now: Date): boolean {
  return differenceInCalendarDays(now, parseISO(iso)) < days;
}

export function uploadLimitError(
  videos: UploadLimitVideo[],
  input: {
    userId: string;
    hostelId: string;
    category: VideoCategory | string;
    filmedAt: string;
  },
  now = new Date(),
): string | null {
  const filmedError = filmedAtLimitError(input.filmedAt, now);
  if (filmedError) return filmedError;

  const mine = videos.filter((video) => video.user_id === input.userId);
  const counted = mine.filter((video) => COUNTED_STATUSES.has(video.status));

  const todayCount = counted.filter((video) => isSameUtcDay(video.created_at, now)).length;
  if (todayCount >= UPLOAD_LIMITS.perDay) {
    return `You can upload ${UPLOAD_LIMITS.perDay} Looksees a day. Try again tomorrow.`;
  }

  const openCount = mine.filter((video) => OPEN_STATUSES.has(video.status)).length;
  if (openCount >= UPLOAD_LIMITS.openQueue) {
    return `You’ve got ${UPLOAD_LIMITS.openQueue} Looksees still processing or waiting for review. Wait for those before uploading more.`;
  }

  const hostelRecent = counted.filter(
    (video) =>
      video.hostel_id === input.hostelId &&
      inRecentWindow(video.created_at, UPLOAD_LIMITS.perHostelDays, now),
  );

  if (hostelRecent.length >= UPLOAD_LIMITS.perHostel) {
    return `Max ${UPLOAD_LIMITS.perHostel} Looksees per hostel every ${UPLOAD_LIMITS.perHostelDays} days. Film another property, or come back later.`;
  }

  const sameCategory = hostelRecent.some((video) => video.category === input.category);
  if (sameCategory) {
    return `You already posted a ${input.category.replace(/_/g, " ")} Looksee for this hostel recently. Pick another area, or wait ${UPLOAD_LIMITS.perHostelDays} days.`;
  }

  return null;
}

export function assertCanCreateUpload(
  videos: UploadLimitVideo[],
  input: {
    userId: string;
    hostelId: string;
    category: VideoCategory | string;
    filmedAt: string;
  },
  now = new Date(),
): void {
  const message = uploadLimitError(videos, input, now);
  if (!message) return;
  const status = filmedAtLimitError(input.filmedAt, now) ? 400 : 429;
  throw new UploadLimitError(message, status);
}
