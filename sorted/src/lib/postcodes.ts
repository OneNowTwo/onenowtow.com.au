export const LOWER_NORTH_SHORE: Record<
  string,
  { suburb: string; nearby: string[] }
> = {
  "2089": { suburb: "Neutral Bay", nearby: ["2090", "2060", "2062", "2088", "2065"] },
  "2090": { suburb: "Cremorne", nearby: ["2089", "2088", "2060", "2062"] },
  "2060": { suburb: "North Sydney", nearby: ["2065", "2089", "2062", "2067"] },
  "2065": { suburb: "Crows Nest", nearby: ["2060", "2067", "2062", "2089"] },
  "2067": { suburb: "Chatswood", nearby: ["2065", "2060"] },
  "2088": { suburb: "Mosman", nearby: ["2089", "2090"] },
  "2062": { suburb: "Cammeray", nearby: ["2060", "2089", "2065"] },
};

export const REGION_POSTCODES = Object.keys(LOWER_NORTH_SHORE);

export function suburbForPostcode(postcode: string): string | undefined {
  return LOWER_NORTH_SHORE[postcode]?.suburb;
}

export function nearbyPostcodes(postcode: string): string[] {
  return LOWER_NORTH_SHORE[postcode]?.nearby ?? [];
}

export function isInRegion(postcode: string): boolean {
  return postcode in LOWER_NORTH_SHORE;
}
