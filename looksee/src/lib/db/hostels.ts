import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";
import { seedDestinations, seedHostelsWithCounts } from "@/lib/seed/data";
import { indexHostelsByAnyId } from "@/lib/db/hostel-ids";
import type { Hostel } from "@/lib/types/database";
import { isValidUuid } from "@/lib/utils/uuid";

/**
 * Seed hostel IDs (e.g. h1000001-...) are not valid Postgres UUIDs.
 * For Supabase uploads, resolve to a real hostels.id (by slug, auto-provision from seed if needed).
 */
export async function resolveHostelIdForUpload(hostelId: string): Promise<string | null> {
  const seedHostel = seedHostelsWithCounts.find((h) => h.id === hostelId && h.active);

  if (!isSupabaseConfigured()) {
    return seedHostel?.id ?? (isValidUuid(hostelId) ? hostelId : null);
  }

  const admin = createAdminClient();

  if (isValidUuid(hostelId)) {
    const { data } = await admin
      .from("hostels")
      .select("id")
      .eq("id", hostelId)
      .eq("active", true)
      .maybeSingle();
    if (data) return data.id;
  }

  if (!seedHostel) return null;

  const { data: bySlug } = await admin
    .from("hostels")
    .select("id")
    .eq("slug", seedHostel.slug)
    .eq("active", true)
    .maybeSingle();
  if (bySlug) return bySlug.id;

  return ensureSeedHostelInDb(seedHostel);
}

async function ensureSeedHostelInDb(hostel: Hostel): Promise<string> {
  const admin = createAdminClient();
  const seedDest = seedDestinations.find((d) => d.id === hostel.destination_id);
  if (!seedDest) {
    throw new Error(`Seed destination missing for hostel ${hostel.slug}`);
  }

  let destinationId: string;
  const { data: destBySlug } = await admin
    .from("destinations")
    .select("id")
    .eq("slug", seedDest.slug)
    .maybeSingle();

  if (destBySlug) {
    destinationId = destBySlug.id;
  } else {
    const { data: inserted, error } = await admin
      .from("destinations")
      .insert({
        name: seedDest.name,
        slug: seedDest.slug,
        country: seedDest.country,
        description: seedDest.description,
        hero_image_url: seedDest.hero_image_url,
        latitude: seedDest.latitude,
        longitude: seedDest.longitude,
        active: seedDest.active,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    destinationId = inserted.id;
  }

  const { data: insertedHostel, error: hostelError } = await admin
    .from("hostels")
    .insert({
      destination_id: destinationId,
      name: hostel.name,
      slug: hostel.slug,
      description: hostel.description,
      address: hostel.address,
      latitude: hostel.latitude,
      longitude: hostel.longitude,
      hero_image_url: hostel.hero_image_url,
      hostelworld_url: hostel.hostelworld_url,
      booking_url: hostel.booking_url,
      direct_url: hostel.direct_url,
      preferred_booking_url: hostel.preferred_booking_url,
      price_from_aud: hostel.price_from_aud,
      active: hostel.active,
    })
    .select("id")
    .single();

  if (hostelError) {
    const { data: existing } = await admin
      .from("hostels")
      .select("id")
      .eq("slug", hostel.slug)
      .maybeSingle();
    if (existing) return existing.id;
    throw new Error(hostelError.message);
  }

  return insertedHostel.id;
}

export async function listDbHostelRefs(): Promise<Array<{ id: string; slug: string }>> {
  if (!isSupabaseConfigured()) return [];
  try {
    const admin = createAdminClient();
    const { data, error } = await admin.from("hostels").select("id, slug");
    if (error) {
      console.error("listDbHostelRefs", error.message);
      return [];
    }
    return (data ?? []) as Array<{ id: string; slug: string }>;
  } catch (error) {
    console.error("listDbHostelRefs", error);
    return [];
  }
}

export async function hostelsByAnyId(): Promise<Map<string, Hostel>> {
  const dbHostels = await listDbHostelRefs();
  return indexHostelsByAnyId(seedHostelsWithCounts, dbHostels);
}

export async function findSeedHostelByAnyId(hostelId: string): Promise<Hostel | null> {
  const map = await hostelsByAnyId();
  return map.get(hostelId) ?? null;
}
