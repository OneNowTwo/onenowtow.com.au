import { describe, expect, it } from "vitest";
import { shouldApplyStatus } from "@/lib/db/video-store";
import { indexHostelsByAnyId, videoBelongsToHostel } from "@/lib/db/hostel-ids";
import { buildRealitySummary } from "@/lib/utils/reality-summary";
import { formatPointsLine, POINTS_LABELS } from "@/lib/db/points";
import {
  AFFILIATE_OFFERS,
  destinationSlugsWithAffiliates,
  POINTS_EARN,
  POINTS_REWARDS,
} from "@/lib/rewards/catalog";
import { uploadLimitError } from "@/lib/uploads/limits";
import type { Hostel, PointsTransaction } from "@/lib/types/database";

describe("shouldApplyStatus", () => {
  it("blocks regressions from approved/rejected/hidden", () => {
    expect(shouldApplyStatus("approved", "pending")).toBe(false);
    expect(shouldApplyStatus("rejected", "processing")).toBe(false);
    expect(shouldApplyStatus("hidden", "approved")).toBe(false);
  });

  it("allows uploading -> processing -> ready -> pending", () => {
    expect(shouldApplyStatus("uploading", "processing")).toBe(true);
    expect(shouldApplyStatus("processing", "ready")).toBe(true);
    expect(shouldApplyStatus("ready", "pending")).toBe(true);
  });

  it("is idempotent for same status", () => {
    expect(shouldApplyStatus("pending", "pending")).toBe(false);
  });
});

describe("buildRealitySummary", () => {
  it("returns empty when no rating data", () => {
    expect(
      buildRealitySummary({
        avg_cleanliness: null,
        avg_sleep: null,
        avg_social: null,
        avg_security: null,
        avg_location: null,
        avg_vibe_score: null,
        video_count: 0,
      }),
    ).toEqual([]);
  });

  it("includes social and location lines for strong scores", () => {
    const lines = buildRealitySummary(
      {
        avg_cleanliness: 4.0,
        avg_sleep: 3.5,
        avg_social: 4.6,
        avg_security: 4.3,
        avg_location: 4.7,
        avg_vibe_score: 30,
        video_count: 3,
      },
      3,
    );
    expect(lines.some((l) => l.includes("social") || l.includes("Social"))).toBe(true);
    expect(lines).toContain("Excellent location");
  });
});

describe("points labels", () => {
  it("formats transaction lines without PII", () => {
    const tx: PointsTransaction = {
      id: "1",
      user_id: "u",
      amount: 100,
      type: "video_approved",
      reference_id: "v",
      description: "Hostel video approved",
      created_at: new Date().toISOString(),
    };
    expect(formatPointsLine(tx)).toBe("+100 — Hostel video approved");
    expect(POINTS_LABELS.first_upload_bonus).toContain("First");
  });
});

describe("points catalog", () => {
  it("keeps earn amounts aligned with the ledger", () => {
    const byId = Object.fromEntries(POINTS_EARN.map((row) => [row.id, row.points]));
    expect(byId.video_approved).toBe(100);
    expect(byId.first_upload_bonus).toBe(100);
    expect(byId.helpful_10).toBe(25);
    expect(byId.helpful_50).toBe(50);
  });

  it("keeps the spend ladder as backpacker marketing currency", () => {
    expect(POINTS_REWARDS.map((row) => row.points)).toEqual([100, 200, 250, 400, 600, 800]);
  });

  it("prices every partner offer on that ladder", () => {
    const ladder = new Set<number>(POINTS_REWARDS.map((row) => row.points));
    for (const offer of AFFILIATE_OFFERS) {
      expect(ladder.has(offer.pointsCost)).toBe(true);
    }
  });

  it("has affiliates for every east-coast destination", () => {
    const slugs = destinationSlugsWithAffiliates().map((d) => d.slug);
    expect(slugs).toEqual(
      expect.arrayContaining([
        "sydney",
        "byron-bay",
        "gold-coast",
        "brisbane",
        "noosa",
        "airlie-beach",
        "cairns",
      ]),
    );
  });
});

describe("hostel id mapping", () => {
  const seedHostel = {
    id: "h1000001-0000-4000-8000-000000000002",
    slug: "sydney-harbour-yha",
  } as Hostel;

  it("maps supabase UUIDs onto seed hostels by slug", () => {
    const lookup = indexHostelsByAnyId(
      [seedHostel],
      [{ id: "122fd7c4-c877-43f9-9907-d2102c11ba79", slug: "sydney-harbour-yha" }],
    );

    expect(lookup.get(seedHostel.id)?.slug).toBe("sydney-harbour-yha");
    expect(lookup.get("122fd7c4-c877-43f9-9907-d2102c11ba79")?.id).toBe(seedHostel.id);
    expect(
      videoBelongsToHostel("122fd7c4-c877-43f9-9907-d2102c11ba79", seedHostel, lookup),
    ).toBe(true);
  });
});

describe("upload limits", () => {
  const now = new Date("2026-08-13T02:00:00.000Z");
  const base = {
    user_id: "user-1",
    hostel_id: "hostel-1",
    category: "dorm",
    status: "pending",
    created_at: "2026-08-13T01:00:00.000Z",
  };

  it("allows a first Looksee filmed today", () => {
    expect(
      uploadLimitError([], {
        userId: "user-1",
        hostelId: "hostel-1",
        category: "dorm",
        filmedAt: "2026-08-13",
      }, now),
    ).toBeNull();
  });

  it("blocks filmed dates older than 14 days", () => {
    expect(
      uploadLimitError([], {
        userId: "user-1",
        hostelId: "hostel-1",
        category: "dorm",
        filmedAt: "2026-07-01",
      }, now),
    ).toMatch(/last 14 days/);
  });

  it("caps three uploads per day", () => {
    const videos = [1, 2, 3].map((i) => ({
      ...base,
      category: i === 1 ? "dorm" : i === 2 ? "bathroom" : "kitchen",
      created_at: `2026-08-13T0${i}:00:00.000Z`,
    }));
    expect(
      uploadLimitError(videos, {
        userId: "user-1",
        hostelId: "hostel-1",
        category: "common_area",
        filmedAt: "2026-08-13",
      }, now),
    ).toMatch(/3 Looksees a day/);
  });

  it("blocks a second clip of the same hostel area", () => {
    expect(
      uploadLimitError([base], {
        userId: "user-1",
        hostelId: "hostel-1",
        category: "dorm",
        filmedAt: "2026-08-13",
      }, now),
    ).toMatch(/dorm/);
  });

  it("ignores rejected videos when counting hostel caps", () => {
    expect(
      uploadLimitError([{ ...base, status: "rejected" }], {
        userId: "user-1",
        hostelId: "hostel-1",
        category: "dorm",
        filmedAt: "2026-08-13",
      }, now),
    ).toBeNull();
  });
});
