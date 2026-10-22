import { describe, expect, it } from "vitest";
import { getLocalCatalog } from "@/lib/data/catalog";
import {
  IMAGES,
  assertUniquePoolUrls,
  createImageAssigner,
  dishPhotoIndex,
  inferDishKind,
} from "@/lib/data/images";

describe("food photo library", () => {
  it("keeps named photos unique and live-shaped", () => {
    const urls = Object.values(IMAGES);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls.every((url) => url.startsWith("https://images."))).toBe(true);
    expect(IMAGES.family).not.toBe(IMAGES.grill);
  });

  it("does not put the same URL in two dish pools", () => {
    expect(assertUniquePoolUrls()).toEqual([]);
  });

  it("reads the dish from the pack name", () => {
    expect(
      inferDishKind(
        "Chicken Robata Table",
        "Grilled chicken, cabbage salad, vegetables and rice create a protein-rich meal.",
      ),
    ).toBe("chicken");
    expect(
      inferDishKind(
        "Yok Seafood Celebration",
        "Grilled fish, prawn salad, greens and fragrant rice make an occasion-worthy Thai spread.",
      ),
    ).toBe("fish");
    expect(
      inferDishKind(
        "Tofu Curry Value Pack",
        "Mild tofu curry, vegetable noodles and rice offer a colourful meat-free dinner.",
        ["vegetarian"],
        ["vegetarian"],
      ),
    ).toBe("curry");
    expect(inferDishKind("Margherita Date Night", "A margherita pizza, tomato salad and shared dessert.")).toBe(
      "pizza",
    );
    expect(
      inferDishKind(
        "Margherita Date Night",
        "A margherita pizza, tomato salad and shared dessert make an uncomplicated dinner for two.",
        ["cheap", "quick", "vegetarian", "comfort", "italian"],
        ["vegetarian"],
      ),
    ).toBe("pizza");
    expect(
      inferDishKind("Tandoori Dinner for Two", "Tandoori chicken, greens, cucumber salad and rice."),
    ).toBe("chicken");
    expect(inferDishKind("Lean Basil Beef Table", "Basil beef, steamed greens, cucumber salad and jasmine rice.")).toBe(
      "beef",
    );
  });

  it("never gives a chicken pack a fish photo", () => {
    const assigner = createImageAssigner();
    const chicken = assigner.claim({
      name: "Chicken Robata Table",
      description: "Grilled chicken, cabbage salad, vegetables and rice.",
      tags: ["healthy"],
      dietaryTags: [],
      cuisine: "Japanese",
    });
    const fish = assigner.claim({
      name: "Grilled Fish Wharf Table",
      description: "Grilled fish, tomato salad, greens and roast vegetables.",
      tags: ["healthy"],
      dietaryTags: [],
      cuisine: "Italian",
    });
    expect(dishPhotoIndex.get(chicken)).toBe("chicken");
    expect(dishPhotoIndex.get(fish)).toBe("fish");
    expect(chicken).not.toBe(fish);
  });
});

const catalog = getLocalCatalog();

describe("catalog dish photos", () => {
  it("matches every pack photo to the dish named on the card", () => {
    const mismatches: string[] = [];
    for (const bundle of catalog.bundles) {
      const expected = inferDishKind(
        bundle.name,
        bundle.description,
        bundle.tags,
        bundle.dietary_tags,
      );
      const actual = dishPhotoIndex.get(bundle.image_url);
      if (actual === expected) continue;
      const related =
        (expected === "veg" && (actual === "curry" || actual === "spread")) ||
        (expected === "curry" && (actual === "veg" || actual === "spread")) ||
        (expected === "spread" && actual === "veg") ||
        (expected === "beef" && actual === "steak");
      if (related) continue;
      mismatches.push(`${bundle.name}: expected ${expected}, got ${actual}`);
    }
    expect(mismatches).toEqual([]);
  });

  it("never puts fish on a chicken pack or chicken on a fish pack", () => {
    for (const bundle of catalog.bundles) {
      const expected = inferDishKind(
        bundle.name,
        bundle.description,
        bundle.tags,
        bundle.dietary_tags,
      );
      const actual = dishPhotoIndex.get(bundle.image_url);
      if (expected === "chicken") expect(actual).toBe("chicken");
      if (expected === "fish") expect(actual).toBe("fish");
      if (expected === "pizza") expect(actual).toBe("pizza");
      if (expected === "pasta") expect(actual).toBe("pasta");
    }
  });

  it("keeps Chicken Robata on a Japanese grilled-chicken photo", () => {
    const pack = catalog.bundles.find((item) => item.name === "Chicken Robata Table");
    expect(pack).toBeTruthy();
    expect(dishPhotoIndex.get(pack!.image_url)).toBe("chicken");
    expect(pack!.image_url).toMatch(/2233729|2233730|1860204|1860205|1860207|1860208|1860202/);
  });

  it("keeps tandoori packs on Indian chicken photos", () => {
    const pack = catalog.bundles.find((item) => item.name === "Tandoori Dinner for Two");
    expect(pack).toBeTruthy();
    expect(dishPhotoIndex.get(pack!.image_url)).toBe("chicken");
    expect(pack!.image_url).toMatch(/1624487|1624485|1624489|2474661|32986472/);
  });
});
