import { describe, expect, it } from "vitest";
import { shouldApplyStatus } from "@/lib/db/video-store";
import { indexHostelsByAnyId, videoBelongsToHostel } from "@/lib/db/hostel-ids";
import { buildRealitySummary } from "@/lib/utils/reality-summary";
import { formatPointsLine, POINTS_LABELS } from "@/lib/db/points";
import {
  destinationSlugsWithAffiliates,
  POINTS_EARN,
} from "@/lib/rewards/catalog";
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
