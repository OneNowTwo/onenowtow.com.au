import { getLocalCatalog } from "@/lib/data/catalog";
import { isSupabaseAdminConfigured, isSupabaseConfigured } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Catalog, DinnerBundle, Restaurant } from "@/lib/types";

let overlay: Catalog = { restaurants: [], bundles: [] };

function mergeCatalog(base: Catalog, extra: Catalog): Catalog {
  const restaurants = new Map(base.restaurants.map((r) => [r.id, r]));
  const bundles = new Map(base.bundles.map((b) => [b.id, b]));
  for (const restaurant of extra.restaurants) restaurants.set(restaurant.id, restaurant);
  for (const bundle of extra.bundles) bundles.set(bundle.id, bundle);
  return {
    restaurants: [...restaurants.values()],
    bundles: [...bundles.values()],
  };
}

async function fetchSupabaseCatalog(): Promise<Catalog | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = isSupabaseAdminConfigured()
      ? createAdminClient()
      : await createClient();
    const [{ data: restaurants, error: rError }, { data: bundles, error: bError }] =
      await Promise.all([
        supabase.from("restaurants").select("*"),
        supabase.from("dinner_bundles").select("*"),
      ]);
    if (rError || bError || !restaurants?.length) return null;
    return {
      restaurants: restaurants as Restaurant[],
      bundles: (bundles ?? []) as DinnerBundle[],
    };
  } catch {
    return null;
  }
}

export async function getCatalog(): Promise<Catalog> {
  const remote = await fetchSupabaseCatalog();
  const base = remote ?? getLocalCatalog();
  return mergeCatalog(base, overlay);
}

export function upsertLocalRestaurant(restaurant: Restaurant): void {
  overlay = mergeCatalog(overlay, { restaurants: [restaurant], bundles: [] });
}

export function upsertLocalBundle(bundle: DinnerBundle): void {
  overlay = mergeCatalog(overlay, { restaurants: [], bundles: [bundle] });
}

export async function getBundleById(id: string) {
  const catalog = await getCatalog();
  const bundle = catalog.bundles.find((item) => item.id === id);
  if (!bundle) return null;
  const restaurant = catalog.restaurants.find((item) => item.id === bundle.restaurant_id);
  if (!restaurant) return null;
  return { bundle, restaurant };
}
