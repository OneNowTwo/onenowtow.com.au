import type { Restaurant } from "@/lib/types";

/** Only return a verified official/ordering URL. Never invent one. */
export function restaurantWebsite(restaurant: Pick<Restaurant, "official_url" | "ordering_url">): string | null {
  const url = restaurant.official_url?.trim() || restaurant.ordering_url?.trim() || "";
  if (!url) return null;
  if (!/^https?:\/\//i.test(url)) return null;
  if (/example\.com/i.test(url)) return null;
  return url;
}
