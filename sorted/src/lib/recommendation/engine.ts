import { nearbyPostcodes, REGION_POSTCODES } from "@/lib/postcodes";
import type {
  Catalog,
  DinnerBundle,
  JoinedBundle,
  RecommendationInput,
  RecommendedDinner,
  Restaurant,
} from "@/lib/types";

export type LocationStrictness = "nearby" | "region" | "any";

function peopleCount(input: RecommendationInput): number {
  return Math.max(1, input.adults + input.children);
}

function joinCatalog(catalog: Catalog): JoinedBundle[] {
  const restaurants = new Map(catalog.restaurants.map((r) => [r.id, r]));
  return catalog.bundles
    .map((bundle) => {
      const restaurant = restaurants.get(bundle.restaurant_id);
      if (!restaurant) return null;
      return { bundle, restaurant };
    })
    .filter((row): row is JoinedBundle => row !== null);
}

function parseAvoided(raw: string): string[] {
  return raw
    .split(/[,./]| and /i)
    .map((part) => part.trim().toLowerCase())
    .filter((part) => part.length > 1);
}

function haystack(bundle: DinnerBundle, restaurant: Restaurant): string {
  return [
    bundle.name,
    bundle.description,
    bundle.tags.join(" "),
    restaurant.name,
    restaurant.cuisine,
  ]
    .join(" ")
    .toLowerCase();
}

export function dietaryCompatible(
  bundle: DinnerBundle,
  dietary: string[],
): boolean {
  const needs = dietary.filter((d) => d && d !== "none");
  if (needs.length === 0) return true;
  const tags = new Set(bundle.dietary_tags);

  for (const need of needs) {
    if (need === "vegetarian" && !(tags.has("vegetarian") || tags.has("vegan"))) {
      return false;
    }
    if (need === "vegan" && !tags.has("vegan")) return false;
    if (need === "gluten-free" && !tags.has("gluten-free")) return false;
    if (need === "dairy-free" && !tags.has("dairy-free")) return false;
    if (need === "nut-allergy" && tags.has("contains-nuts")) return false;
    if (need === "no-seafood" && tags.has("seafood")) return false;
  }
  return true;
}

export function avoidedFoodsOk(
  row: JoinedBundle,
  avoidedFoods: string,
): boolean {
  const tokens = parseAvoided(avoidedFoods);
  if (tokens.length === 0) return true;
  const text = haystack(row.bundle, row.restaurant);
  return !tokens.some((token) => text.includes(token));
}

export function feedsEnough(bundle: DinnerBundle, people: number): boolean {
  return bundle.feeds_people >= people;
}

export function budgetOk(
  bundle: DinnerBundle,
  input: RecommendationInput,
  slack = 1,
): boolean {
  if (input.budgetMax != null) {
    if (bundle.price > input.budgetMax * slack) return false;
  }
  if (input.budgetMin != null && slack <= 1) {
    // Slightly under a minimum band is still fine.
    if (bundle.price < input.budgetMin * 0.75) return false;
  }
  return true;
}

export function locationOk(
  restaurant: Restaurant,
  input: RecommendationInput,
  strictness: LocationStrictness,
): boolean {
  if (strictness === "any") return true;
  const postcode = input.postcode;
  if (restaurant.postcode === postcode) return true;
  if (input.suburb && restaurant.suburb === input.suburb) return true;
  if (strictness === "nearby") {
    return nearbyPostcodes(postcode).includes(restaurant.postcode);
  }
  return REGION_POSTCODES.includes(restaurant.postcode);
}

function cuisineMatches(restaurant: Restaurant, favourites: string[]): boolean {
  const cuisine = restaurant.cuisine.toLowerCase();
  return favourites.some((fav) => {
    const f = fav.toLowerCase();
    if (f === cuisine) return true;
    if (f === "healthy bowls" && cuisine.includes("bowl")) return true;
    if (f === "burgers" && cuisine.includes("burger")) return true;
    return cuisine.includes(f) || f.includes(cuisine);
  });
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function scoreBundle(row: JoinedBundle, input: RecommendationInput): number {
  const { bundle, restaurant } = row;
  const people = peopleCount(input);
  let score = 40;

  if (restaurant.postcode === input.postcode || restaurant.suburb === input.suburb) {
    score += 28;
  } else if (nearbyPostcodes(input.postcode).includes(restaurant.postcode)) {
    score += 16;
  } else if (REGION_POSTCODES.includes(restaurant.postcode)) {
    score += 6;
  }

  if (bundle.feeds_people === people) score += 16;
  else if (bundle.feeds_people === people + 1) score += 10;
  else if (bundle.feeds_people > people + 2) score -= 6;
  else score += 6;

  if (input.budgetMax != null) {
    if (bundle.price <= input.budgetMax) {
      const room = input.budgetMax - bundle.price;
      score += 22 + Math.min(10, Math.round(room / 4));
    } else {
      score -= 18;
    }
  }
  if (input.budgetMin != null && bundle.price >= input.budgetMin) {
    score += 6;
  }

  if (input.favouriteCuisines.length > 0) {
    if (cuisineMatches(restaurant, input.favouriteCuisines)) {
      score += 34;
    } else {
      score -= 6;
    }
  }

  const moods = new Set(input.moodTags);
  const tags = new Set(bundle.tags);

  if (moods.has("quick")) {
    if (bundle.estimated_minutes <= 30) score += 20;
    else if (bundle.estimated_minutes <= 35) score += 14;
    else score -= 8;
    if (tags.has("quick")) score += 8;
  }
  if (moods.has("healthy")) {
    if (tags.has("healthy")) score += 36;
    else score -= 28;
    if (tags.has("burgers") || tags.has("pizza") || tags.has("fried")) score -= 24;
  }
  if (moods.has("cheap")) {
    if (tags.has("cheap") || bundle.price <= 52) score += 22;
    score += Math.max(0, Math.round((70 - bundle.price) / 3));
    if (input.budgetMax != null && bundle.price > input.budgetMax * 0.85) score -= 12;
    if (tags.has("treat")) score -= 10;
  }
  if (moods.has("comfort") && tags.has("comfort")) score += 18;
  if (moods.has("treat")) {
    if (tags.has("treat")) score += 20;
    if (bundle.price >= 70) score += 8;
  }
  if (moods.has("kids")) {
    if (tags.has("kids") || tags.has("family")) score += 20;
    else score -= 6;
  }
  if (moods.has("high-protein")) {
    if (tags.has("high-protein")) score += 26;
    else if (tags.has("healthy")) score += 8;
    else score -= 6;
  }
  if (moods.has("surprise")) {
    const seed = `${input.postcode}-${people}-${input.moodTags.join(",")}`;
    score += (hashString(seed + bundle.id) % 17) - 4;
    if (!cuisineMatches(restaurant, input.favouriteCuisines)) score += 6;
  }

  return score;
}

function wordPeople(n: number): string {
  const words = ["one", "two", "three", "four", "five", "six", "seven", "eight"];
  return words[n - 1] ?? String(n);
}

function budgetLabel(max?: number | null): string | null {
  if (max == null) return null;
  return `$${max}`;
}

export function buildReason(row: JoinedBundle, input: RecommendationInput): string {
  const { bundle, restaurant } = row;
  const people = peopleCount(input);
  const preferred = cuisineMatches(restaurant, input.favouriteCuisines);
  const moods = input.moodTags.filter((m) => m !== "surprise");
  const max = budgetLabel(input.budgetMax);

  if (preferred && max && feedsEnough(bundle, people)) {
    return `Fits your ${max} budget, feeds ${wordPeople(people)} and matches your preference for ${restaurant.cuisine} food.`;
  }
  if (moods.includes("healthy") && bundle.tags.includes("healthy")) {
    return `A lighter pick from ${restaurant.name} that still feeds ${wordPeople(people)}.`;
  }
  if (moods.includes("healthy") && bundle.tags.includes("high-protein")) {
    return "Higher-protein option that still stays within your normal dinner spend.";
  }
  if (moods.includes("kids") || bundle.tags.includes("kids")) {
    return "Good option when you want something easy that everyone is likely to eat.";
  }
  if (moods.includes("quick") && bundle.estimated_minutes <= 35) {
    return `Nearby in ${restaurant.suburb}, ready in about ${bundle.estimated_minutes} minutes.`;
  }
  if (moods.includes("cheap") || (max && bundle.price <= (input.budgetMax ?? 0))) {
    return `Comfortable under your ${max ?? "usual"} budget and still feeds ${wordPeople(people)}.`;
  }
  if (moods.includes("comfort")) {
    return `A comfort pick from ${restaurant.suburb} that should land well with the table.`;
  }
  if (moods.includes("treat")) {
    return `A little more special than a default weeknight, without turning dinner into a project.`;
  }
  return `A solid match for ${people} in ${restaurant.suburb} tonight.`;
}

function pickDiverse(
  scored: RecommendedDinner[],
  limit: number,
  input: RecommendationInput,
): RecommendedDinner[] {
  const picked: RecommendedDinner[] = [];
  const usedRestaurants = new Set<string>();
  const usedCuisines = new Set<string>();
  const moods = new Set(input.moodTags);

  const tryPick = (predicate: (item: RecommendedDinner) => boolean) => {
    for (const item of scored) {
      if (picked.length >= limit) return;
      if (picked.some((p) => p.bundle.id === item.bundle.id)) continue;
      if (!predicate(item)) continue;
      picked.push(item);
      usedRestaurants.add(item.restaurant.id);
      usedCuisines.add(item.restaurant.cuisine);
    }
  };

  const healthyAvailable = scored.filter((item) => item.bundle.tags.includes("healthy")).length;
  if (moods.has("healthy") && healthyAvailable >= 2) {
    if (moods.has("quick")) {
      tryPick(
        (item) =>
          item.bundle.tags.includes("healthy") &&
          item.bundle.estimated_minutes <= 35 &&
          !usedRestaurants.has(item.restaurant.id),
      );
      tryPick(
        (item) =>
          item.bundle.tags.includes("healthy") && item.bundle.estimated_minutes <= 35,
      );
    }
    tryPick((item) => item.bundle.tags.includes("healthy") && !usedRestaurants.has(item.restaurant.id));
    tryPick((item) => item.bundle.tags.includes("healthy"));
  }

  if (moods.has("cheap") && picked.length < limit) {
    tryPick(
      (item) =>
        (item.bundle.tags.includes("cheap") || item.bundle.price <= 55) &&
        !usedRestaurants.has(item.restaurant.id),
    );
    tryPick((item) => item.bundle.tags.includes("cheap") || item.bundle.price <= 55);
  }

  if (moods.has("quick") && picked.length < limit) {
    tryPick(
      (item) =>
        item.bundle.estimated_minutes <= 30 && !usedRestaurants.has(item.restaurant.id),
    );
  }

  tryPick(
    (item) =>
      !usedRestaurants.has(item.restaurant.id) &&
      !usedCuisines.has(item.restaurant.cuisine),
  );
  tryPick((item) => !usedRestaurants.has(item.restaurant.id));
  tryPick(() => true);

  return picked.slice(0, limit).map((item, index) => ({
    ...item,
    rank: index + 1,
  }));
}

function applyPass(
  candidates: JoinedBundle[],
  input: RecommendationInput,
  people: number,
  options: {
    dietary: boolean;
    avoided: boolean;
    feeds: "exact" | "almost" | "any";
    budgetSlack: number;
    location: LocationStrictness;
  },
): JoinedBundle[] {
  return candidates.filter((row) => {
    if (options.dietary && !dietaryCompatible(row.bundle, input.dietaryRequirements)) {
      return false;
    }
    if (options.avoided && !avoidedFoodsOk(row, input.avoidedFoods)) return false;
    if (options.feeds === "exact" && !feedsEnough(row.bundle, people)) return false;
    if (options.feeds === "almost" && row.bundle.feeds_people < Math.max(1, people - 1)) {
      return false;
    }
    if (!budgetOk(row.bundle, input, options.budgetSlack)) return false;
    if (!locationOk(row.restaurant, input, options.location)) return false;
    return true;
  });
}

export function recommend(
  input: RecommendationInput,
  catalog: Catalog,
  options?: { limit?: number },
): RecommendedDinner[] {
  const limit = options?.limit ?? 3;
  const people = peopleCount(input);
  const excluded = new Set(input.excludeBundleIds ?? []);

  const candidates = joinCatalog(catalog).filter(
    (row) =>
      row.bundle.active &&
      row.restaurant.active &&
      row.restaurant.dinner_suitable !== false &&
      !excluded.has(row.bundle.id),
  );

  const passes: Array<Parameters<typeof applyPass>[3]> = [
    { dietary: true, avoided: true, feeds: "exact", budgetSlack: 1, location: "nearby" },
    { dietary: true, avoided: true, feeds: "exact", budgetSlack: 1, location: "region" },
    { dietary: true, avoided: true, feeds: "exact", budgetSlack: 1.2, location: "region" },
    { dietary: true, avoided: true, feeds: "almost", budgetSlack: 1.25, location: "any" },
    { dietary: true, avoided: false, feeds: "almost", budgetSlack: 1.4, location: "any" },
    { dietary: true, avoided: false, feeds: "any", budgetSlack: 99, location: "any" },
  ];

  let pool: JoinedBundle[] = [];
  for (const pass of passes) {
    pool = applyPass(candidates, input, people, pass);
    if (pool.length >= limit) break;
  }

  const scored: RecommendedDinner[] = pool
    .map((row) => ({
      bundle: row.bundle,
      restaurant: row.restaurant,
      score: scoreBundle(row, input),
      reason: buildReason(row, input),
      rank: 0,
    }))
    .sort((a, b) => b.score - a.score || a.bundle.price - b.bundle.price);

  return pickDiverse(scored, limit, input);
}

export const recommendationEngine = {
  recommend,
  scoreBundle,
  dietaryCompatible,
  budgetOk,
  feedsEnough,
};
