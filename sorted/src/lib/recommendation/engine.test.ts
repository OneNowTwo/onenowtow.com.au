import { describe, expect, it } from "vitest";
import { getLocalCatalog } from "@/lib/data/catalog";
import {
  dietaryCompatible,
  recommend,
  scoreBundle,
} from "@/lib/recommendation/engine";
import type { Catalog, DinnerBundle, RecommendationInput, Restaurant } from "@/lib/types";

const catalog = getLocalCatalog();

function baseInput(overrides: Partial<RecommendationInput> = {}): RecommendationInput {
  return {
    postcode: "2095",
    suburb: "Manly",
    adults: 2,
    children: 2,
    dietaryRequirements: [],
    favouriteCuisines: ["Thai", "Italian"],
    avoidedFoods: "",
    moodTags: ["quick", "healthy"],
    budgetMin: 0,
    budgetMax: 70,
    ...overrides,
  };
}

function tinyCatalog(): Catalog {
  const restaurant = (id: string, cuisine: string, postcode: string, suburb: string): Restaurant => ({
    id,
    name: id,
    slug: id,
    description: cuisine,
    address: "1 Test St",
    suburb,
    postcode,
    cuisine,
    image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
    ordering_url: "https://example.com",
    active: true,
    created_at: "2026-01-01T00:00:00.000Z",
  });

  const bundle = (
    id: string,
    restaurantId: string,
    price: number,
    feeds: number,
    tags: string[],
    dietary: string[],
    description: string,
  ): DinnerBundle => ({
    id,
    restaurant_id: restaurantId,
    name: id,
    description,
    price,
    feeds_people: feeds,
    estimated_minutes: 30,
    image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
    active: true,
    available_days: ["mon"],
    tags,
    dietary_tags: dietary,
    created_at: "2026-01-01T00:00:00.000Z",
  });

  return {
    restaurants: [
      restaurant("thai-nb", "Thai", "2089", "Neutral Bay"),
      restaurant("italian-cn", "Italian", "2065", "Crows Nest"),
      restaurant("burger-ns", "Burgers", "2060", "North Sydney"),
      restaurant("vegan-mos", "Healthy bowls", "2088", "Mosman"),
    ],
    bundles: [
      bundle("thai-family", "thai-nb", 58, 4, ["quick", "thai", "family"], ["contains-nuts"], "Green curry family pack"),
      bundle("italian-family", "italian-cn", 64, 4, ["italian", "comfort", "kids"], [], "Pizza and pasta"),
      bundle("burger-two", "burger-ns", 39, 2, ["burgers", "cheap", "quick"], [], "Two smash burgers"),
      bundle("vegan-bowls", "vegan-mos", 45, 4, ["healthy", "vegetarian"], ["vegan", "vegetarian", "dairy-free"], "Tofu bowls"),
      bundle("thai-treat", "thai-nb", 88, 5, ["treat", "thai"], ["contains-nuts"], "Thai banquet"),
      bundle("italian-pasta", "italian-cn", 49, 3, ["italian", "cheap"], [], "Pasta night"),
    ],
  };
}

describe("recommendation engine", () => {
  it("returns exactly three results from the full catalog", () => {
    const results = recommend(baseInput(), catalog);
    expect(results).toHaveLength(3);
    expect(new Set(results.map((r) => r.bundle.id)).size).toBe(3);
  });

  it("filters out bundles that exceed the budget in the first pass", () => {
    const results = recommend(baseInput({ budgetMax: 70, budgetMin: 0 }), catalog);
    expect(results.every((r) => r.bundle.price <= 70 * 1.2)).toBe(true);
  });

  it("only returns bundles that feed enough people when possible", () => {
    const results = recommend(baseInput({ adults: 2, children: 2 }), catalog);
    expect(results.every((r) => r.bundle.feeds_people >= 4)).toBe(true);
  });

  it("excludes meat bundles for vegetarian households", () => {
    const results = recommend(
      baseInput({
        dietaryRequirements: ["vegetarian"],
        favouriteCuisines: [],
        moodTags: [],
        budgetMax: null,
      }),
      catalog,
    );
    expect(results.length).toBeGreaterThan(0);
    expect(
      results.every((r) =>
        dietaryCompatible(r.bundle, ["vegetarian"]),
      ),
    ).toBe(true);
  });

  it("excludes bundles with nuts when a nut allergy is set", () => {
    const results = recommend(
      baseInput({
        dietaryRequirements: ["nut-allergy"],
        favouriteCuisines: ["Thai"],
        moodTags: ["quick"],
      }),
      catalog,
    );
    expect(results.every((r) => !r.bundle.dietary_tags.includes("contains-nuts"))).toBe(
      true,
    );
  });

  it("weights preferred cuisine higher", () => {
    const cat = tinyCatalog();
    const thaiRow = {
      bundle: cat.bundles.find((item) => item.id === "thai-family")!,
      restaurant: cat.restaurants.find((item) => item.id === "thai-nb")!,
    };
    const italianRow = {
      bundle: cat.bundles.find((item) => item.id === "italian-family")!,
      restaurant: cat.restaurants.find((item) => item.id === "italian-cn")!,
    };
    const preferThai = baseInput({ favouriteCuisines: ["Thai"], moodTags: [] });
    const preferItalian = baseInput({ favouriteCuisines: ["Italian"], moodTags: [] });

    expect(scoreBundle(thaiRow, preferThai)).toBeGreaterThan(scoreBundle(italianRow, preferThai));
    expect(scoreBundle(italianRow, preferItalian)).toBeGreaterThan(scoreBundle(thaiRow, preferItalian));
  });

  it("weights selected moods", () => {
    const cheap = recommend(
      baseInput({ moodTags: ["cheap"], favouriteCuisines: [], budgetMax: 60 }),
      tinyCatalog(),
    );
    const treat = recommend(
      baseInput({ moodTags: ["treat"], favouriteCuisines: [], budgetMax: 100 }),
      tinyCatalog(),
    );
    expect(cheap[0]?.bundle.price).toBeLessThan(treat[0]?.bundle.price ?? 999);
  });

  it("replaces rather than appends when previous ids are excluded", () => {
    const first = recommend(baseInput(), catalog);
    const second = recommend(
      baseInput({ excludeBundleIds: first.map((r) => r.bundle.id) }),
      catalog,
    );
    expect(second).toHaveLength(3);
    const overlap = second.filter((s) => first.some((f) => f.bundle.id === s.bundle.id));
    expect(overlap).toHaveLength(0);
  });

  it("falls back to nearby options when the budget is tight", () => {
    const results = recommend(baseInput({ budgetMax: 42, budgetMin: 0, moodTags: ["cheap"] }), catalog);
    expect(results).toHaveLength(3);
  });

  it("returns fewer than three rather than breaking dietary rules", () => {
    const veganOnly: Catalog = {
      restaurants: tinyCatalog().restaurants,
      bundles: tinyCatalog().bundles.filter((b) => !b.dietary_tags.includes("vegan")),
    };
    const results = recommend(
      baseInput({ dietaryRequirements: ["vegan"], budgetMax: null, moodTags: [] }),
      veganOnly,
    );
    expect(results.every((r) => r.bundle.dietary_tags.includes("vegan"))).toBe(true);
    expect(results.length).toBeLessThan(3);
  });

  it("scores a Manly Thai family bundle well for the Taylor-style household", () => {
    const thaiFamily = catalog.bundles.find((b) => b.name === "Family Thai Night");
    const restaurant = catalog.restaurants.find((r) => r.id === thaiFamily?.restaurant_id);
    expect(thaiFamily && restaurant).toBeTruthy();
    if (!thaiFamily || !restaurant) return;
    const score = scoreBundle({ bundle: thaiFamily, restaurant }, baseInput());
    const burger = catalog.bundles.find((b) => b.name === "Double Date Burgers");
    const burgerRest = catalog.restaurants.find((r) => r.id === burger?.restaurant_id);
    if (!burger || !burgerRest) return;
    const burgerScore = scoreBundle({ bundle: burger, restaurant: burgerRest }, baseInput());
    expect(score).toBeGreaterThan(burgerScore);
  });

  it("keeps recommendations in the Manly restaurant pool", () => {
    const results = recommend(baseInput(), catalog);
    expect(results.every((item) => item.restaurant.postcode === "2095")).toBe(true);
    expect(results.every((item) => item.restaurant.suburb === "Manly")).toBe(true);
  });

  it("returns at least two clearly healthy packs when Healthy is selected", () => {
    const results = recommend(
      baseInput({
        moodTags: ["healthy"],
        favouriteCuisines: [],
        budgetMin: 60,
        budgetMax: 80,
      }),
      catalog,
    );
    expect(results).toHaveLength(3);
    expect(results.filter((item) => item.bundle.tags.includes("healthy")).length).toBeGreaterThanOrEqual(2);
    expect(
      results.every(
        (item) => !item.bundle.tags.includes("pizza") && !item.bundle.tags.includes("burgers"),
      ),
    ).toBe(true);
  });

  it("does not return burgers or pizza first for Healthy + Quick", () => {
    const results = recommend(
      baseInput({
        moodTags: ["healthy", "quick"],
        favouriteCuisines: [],
        budgetMin: 60,
        budgetMax: 80,
      }),
      catalog,
    );
    expect(results).toHaveLength(3);
    expect(results.filter((item) => item.bundle.tags.includes("healthy")).length).toBeGreaterThanOrEqual(2);
    expect(results[0]?.bundle.tags.includes("healthy")).toBe(true);
  });

  it("prioritises cheaper packs when Cheap is selected", () => {
    const cheap = recommend(
      baseInput({ moodTags: ["cheap"], favouriteCuisines: [], budgetMin: 0, budgetMax: 80 }),
      catalog,
    );
    const treat = recommend(
      baseInput({ moodTags: ["treat"], favouriteCuisines: [], budgetMin: 0, budgetMax: 110 }),
      catalog,
    );
    const cheapAvg = cheap.reduce((sum, item) => sum + item.bundle.price, 0) / cheap.length;
    const treatAvg = treat.reduce((sum, item) => sum + item.bundle.price, 0) / treat.length;
    expect(cheapAvg).toBeLessThan(treatAvg);
  });

  it("excludes seafood when the household asks for no seafood", () => {
    const results = recommend(
      baseInput({
        dietaryRequirements: ["no-seafood"],
        favouriteCuisines: [],
        moodTags: ["healthy"],
      }),
      catalog,
    );
    expect(results.every((item) => !item.bundle.dietary_tags.includes("seafood"))).toBe(true);
  });

  it("excludes breakfast-only venues from dinner recommendations", () => {
    const breakfast: Catalog = {
      restaurants: [
        {
          id: "cafe",
          name: "Breakfast Only Cafe",
          slug: "breakfast-only",
          description: "Closes at 3pm",
          address: "1 Test St",
          suburb: "Manly",
          postcode: "2095",
          cuisine: "Cafe",
          image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
          ordering_url: "https://example.com",
          dinner_suitable: false,
          active: true,
          created_at: "2026-01-01T00:00:00.000Z",
        },
        ...tinyCatalog().restaurants,
      ],
      bundles: [
        {
          id: "breakfast-pack",
          restaurant_id: "cafe",
          name: "Avocado Toast Box",
          description: "Breakfast",
          price: 42,
          feeds_people: 4,
          estimated_minutes: 20,
          image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
          active: true,
          available_days: ["mon"],
          tags: ["healthy", "quick"],
          dietary_tags: ["vegetarian"],
          created_at: "2026-01-01T00:00:00.000Z",
        },
        ...tinyCatalog().bundles,
      ],
    };
    const results = recommend(baseInput({ favouriteCuisines: [], moodTags: [] }), breakfast);
    expect(results.every((item) => item.restaurant.id !== "cafe")).toBe(true);
  });
});
