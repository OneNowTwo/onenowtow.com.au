import { describe, expect, it } from "vitest";
import { labelAlternatives } from "./roles";
import type { DinnerBundle, RecommendedDinner, Restaurant } from "@/lib/types";

const restaurant: Restaurant = {
  id: "rest-1",
  name: "Test Kitchen",
  slug: "test-kitchen",
  description: "Test",
  address: "1 Test St",
  suburb: "Neutral Bay",
  postcode: "2089",
  cuisine: "Thai",
  image_url: "https://example.com/r.jpg",
  ordering_url: "https://example.com",
  active: true,
  created_at: "2026-01-01",
};

function item(id: string, overrides: Partial<DinnerBundle> = {}): RecommendedDinner {
  return {
    restaurant,
    score: 1,
    reason: "Because",
    rank: 1,
    bundle: {
      id,
      restaurant_id: restaurant.id,
      name: id,
      description: "Dinner",
      price: 60,
      feeds_people: 4,
      estimated_minutes: 35,
      image_url: "https://example.com/b.jpg",
      active: true,
      available_days: ["mon"],
      tags: [],
      dietary_tags: [],
      created_at: "2026-01-01",
      ...overrides,
    },
  };
}

describe("labelAlternatives", () => {
  it("does not label the primary result and gives distinct roles to the rest", () => {
    const results = [
      item("primary", { price: 80, estimated_minutes: 45, tags: ["treat"] }),
      item("healthy", { price: 72, estimated_minutes: 40, tags: ["healthy", "high-protein"] }),
      item("value", { price: 42, estimated_minutes: 30, tags: ["cheap"] }),
    ];
    const labels = labelAlternatives(results);
    expect(labels.has("primary")).toBe(false);
    expect(labels.get("healthy")).toBe("Healthier pick");
    expect(labels.get("value")).toBe("Best value");
    expect(new Set(labels.values()).size).toBe(2);
  });

  it("chooses Quickest and Safe family pick from matching data", () => {
    const results = [
      item("primary", { price: 80, estimated_minutes: 35, tags: ["thai"] }),
      item("fast", { price: 90, estimated_minutes: 12, tags: ["quick"] }),
      item("family", {
        price: 88,
        estimated_minutes: 40,
        tags: ["kids", "family", "comfort"],
      }),
    ];
    const labels = labelAlternatives(results);
    expect(labels.get("fast")).toBe("Quickest");
    expect(labels.get("family")).toBe("Safe family pick");
  });
});
