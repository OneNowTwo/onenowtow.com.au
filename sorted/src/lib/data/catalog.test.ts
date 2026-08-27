import { describe, expect, it } from "vitest";
import { getLocalCatalog } from "@/lib/data/catalog";
import { restaurantWebsite } from "@/lib/restaurants";

const catalog = getLocalCatalog();

describe("Manly catalog", () => {
  it("contains 25–30 verified Manly restaurants and 100–130 concept packs", () => {
    expect(catalog.restaurants.length).toBeGreaterThanOrEqual(25);
    expect(catalog.restaurants.length).toBeLessThanOrEqual(30);
    expect(catalog.bundles.length).toBeGreaterThanOrEqual(100);
    expect(catalog.bundles.length).toBeLessThanOrEqual(130);
  });

  it("keeps the restaurant pool in Manly 2095", () => {
    expect(catalog.restaurants.every((item) => item.postcode === "2095")).toBe(true);
    expect(catalog.restaurants.every((item) => item.suburb === "Manly")).toBe(true);
    expect(catalog.restaurants.every((item) => item.verified !== false)).toBe(true);
  });

  it("marks every Sorted Pack as a prototype concept", () => {
    expect(catalog.bundles.every((item) => item.is_concept_bundle === true)).toBe(true);
  });

  it("does not invent restaurant URLs", () => {
    for (const restaurant of catalog.restaurants) {
      const url = restaurant.official_url || restaurant.ordering_url;
      if (!url) continue;
      expect(url).toMatch(/^https?:\/\//i);
      expect(url).not.toMatch(/example\.com/i);
    }
    expect(restaurantWebsite({ official_url: "", ordering_url: "" })).toBeNull();
    expect(restaurantWebsite({ official_url: "https://example.com", ordering_url: "" })).toBeNull();
    expect(restaurantWebsite({ official_url: "https://www.manlythaigourmet.com/", ordering_url: "" })).toBe(
      "https://www.manlythaigourmet.com/",
    );
  });

  it("has enough healthy, cheap and vegetarian-compatible concepts", () => {
    const healthy = catalog.bundles.filter((item) => item.tags.includes("healthy"));
    const cheap = catalog.bundles.filter(
      (item) => item.tags.includes("cheap") || item.price <= 55,
    );
    const vegetarian = catalog.bundles.filter(
      (item) =>
        item.dietary_tags.includes("vegetarian") ||
        item.dietary_tags.includes("vegan") ||
        item.tags.includes("vegetarian"),
    );
    expect(healthy.length).toBeGreaterThanOrEqual(25);
    expect(cheap.length).toBeGreaterThanOrEqual(20);
    expect(vegetarian.length).toBeGreaterThanOrEqual(20);
    expect(healthy.every((item) => !item.tags.includes("pizza") && !item.tags.includes("burgers"))).toBe(
      true,
    );
  });

  it("does not recommend lunch-only venues in the dinner pool", () => {
    expect(catalog.restaurants.every((item) => item.dinner_suitable !== false)).toBe(true);
  });
});
