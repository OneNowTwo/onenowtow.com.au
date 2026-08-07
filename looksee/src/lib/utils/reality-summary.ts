import type { Hostel } from "@/lib/types/database";

/**
 * Rule-based "Travellers say" summary from aggregate ratings.
 * No AI required for V1.
 */
export function buildRealitySummary(
  hostel: Pick<
    Hostel,
    | "avg_cleanliness"
    | "avg_sleep"
    | "avg_social"
    | "avg_security"
    | "avg_location"
    | "avg_vibe_score"
    | "video_count"
  >,
  ratingCount = 0,
): string[] {
  if (
    ratingCount < 1 &&
    hostel.avg_cleanliness == null &&
    hostel.avg_sleep == null &&
    (hostel.video_count ?? 0) < 1
  ) {
    return [];
  }

  const hasScores =
    hostel.avg_cleanliness != null ||
    hostel.avg_sleep != null ||
    hostel.avg_social != null ||
    hostel.avg_security != null ||
    hostel.avg_location != null;

  if (!hasScores) {
    return [];
  }

  const lines: string[] = [];
  const social = hostel.avg_social ?? 0;
  const sleep = hostel.avg_sleep ?? 0;
  const cleanliness = hostel.avg_cleanliness ?? 0;
  const security = hostel.avg_security ?? 0;
  const location = hostel.avg_location ?? 0;
  const vibe = hostel.avg_vibe_score ?? 50;

  if (social >= 4.4) lines.push("Very social");
  else if (social >= 3.8) lines.push("Easy to meet people");
  else if (social > 0 && social < 3.4) lines.push("Quieter crowd");

  if (security >= 4.2) lines.push("Travellers rate security highly");
  else if (security > 0 && security < 3.6) lines.push("Keep valuables close");

  if (cleanliness >= 4.3) lines.push("Bathrooms are well kept");
  else if (cleanliness >= 3.7) lines.push("Bathrooms are average");
  else if (cleanliness > 0) lines.push("Bathrooms need attention");

  if (sleep > 0 && sleep < 3.4) lines.push("Expect some noise");
  else if (sleep < 3.4 || vibe <= 25) lines.push("Can get noisy after midnight");
  else if (sleep >= 4.2) lines.push("Decent sleep if you pack earplugs");

  if (location >= 4.5) lines.push("Excellent location");
  else if (location >= 4.0) lines.push("Convenient location");
  else if (location > 0 && location < 3.8) lines.push("A bit of a walk from the centre");

  if (vibe >= 70) lines.push("More chill than party");
  else if (vibe <= 20) lines.push("Party-first vibe");

  return Array.from(new Set(lines)).slice(0, 5);
}
