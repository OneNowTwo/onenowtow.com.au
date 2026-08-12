import type { Hostel } from "@/lib/types/database";

/** Map seed IDs and live Supabase UUIDs (by slug) onto the same seed hostel. */
export function indexHostelsByAnyId(
  seedHostels: Hostel[],
  dbHostels: Array<{ id: string; slug: string }>,
): Map<string, Hostel> {
  const bySlug = new Map(seedHostels.map((hostel) => [hostel.slug, hostel]));
  const map = new Map<string, Hostel>();

  for (const hostel of seedHostels) {
    map.set(hostel.id, hostel);
  }

  for (const row of dbHostels) {
    const seed = bySlug.get(row.slug);
    if (seed) map.set(row.id, seed);
  }

  return map;
}

export function videoBelongsToHostel(
  videoHostelId: string,
  seedHostel: Hostel,
  hostelsByAnyId: Map<string, Hostel>,
): boolean {
  if (videoHostelId === seedHostel.id) return true;
  return hostelsByAnyId.get(videoHostelId)?.id === seedHostel.id;
}
