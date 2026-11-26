import { describe, expect, it, beforeEach, vi } from "vitest";
import { STORAGE_KEYS } from "@/lib/constants";

const memory = new Map<string, string>();

beforeEach(() => {
  memory.clear();
  vi.stubGlobal("window", {
    localStorage: {
      getItem: (key: string) => memory.get(key) ?? null,
      setItem: (key: string, value: string) => {
        memory.set(key, value);
      },
      removeItem: (key: string) => {
        memory.delete(key);
      },
    },
    sessionStorage: {
      getItem: (key: string) => memory.get(`session:${key}`) ?? null,
      setItem: (key: string, value: string) => {
        memory.set(`session:${key}`, value);
      },
      removeItem: (key: string) => {
        memory.delete(`session:${key}`);
      },
    },
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  });
});

describe("guest storage", () => {
  it("persists favourites across reads", async () => {
    const { writeFavourites, readFavourites } = await import("@/lib/storage");
    writeFavourites([
      {
        id: "fav-1",
        dinner_bundle_id: "00000000-0000-4000-b000-000000000001",
        created_at: "2026-08-01T00:00:00.000Z",
      },
    ]);
    expect(readFavourites()).toHaveLength(1);
    expect(readFavourites()[0]?.dinner_bundle_id).toBe("00000000-0000-4000-b000-000000000001");
    expect(memory.get(STORAGE_KEYS.favourites)).toContain("00000000-0000-4000-b000-000000000001");
  });

  it("clears the last Tonight session so navigation can start fresh", async () => {
    const { writeSession, readSession, clearSession } = await import("@/lib/storage");
    writeSession({
      id: "session-1",
      input: {
        postcode: "2095",
        adults: 2,
        children: 2,
        dietaryRequirements: [],
        favouriteCuisines: [],
        avoidedFoods: "",
        moodTags: ["healthy"],
      },
      results: [],
      createdAt: "2026-08-01T00:00:00.000Z",
    });
    expect(readSession()?.id).toBe("session-1");
    clearSession();
    expect(readSession()).toBeNull();
  });
});
