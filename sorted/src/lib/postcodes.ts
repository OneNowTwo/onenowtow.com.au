export const MANLY_CATCHMENT: Record<string, { suburb: string; nearby: string[] }> = {
  "2095": { suburb: "Manly", nearby: ["2094", "2093", "2096", "2092"] },
  "2094": { suburb: "Fairlight", nearby: ["2095", "2093", "2092"] },
  "2093": { suburb: "Balgowlah", nearby: ["2095", "2094", "2092"] },
  "2096": { suburb: "Freshwater", nearby: ["2095", "2094"] },
  "2092": { suburb: "Seaforth", nearby: ["2095", "2094", "2093"] },
};

/** @deprecated Use MANLY_CATCHMENT. Kept so older tests/imports keep compiling. */
export const LOWER_NORTH_SHORE = MANLY_CATCHMENT;

export const REGION_POSTCODES = Object.keys(MANLY_CATCHMENT);

export function suburbForPostcode(postcode: string): string | undefined {
  return MANLY_CATCHMENT[postcode]?.suburb;
}

export function nearbyPostcodes(postcode: string): string[] {
  return MANLY_CATCHMENT[postcode]?.nearby ?? [];
}

export function isInRegion(postcode: string): boolean {
  return postcode in MANLY_CATCHMENT;
}
