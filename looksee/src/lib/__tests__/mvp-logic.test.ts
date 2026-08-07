import { describe, expect, it } from "vitest";
import { shouldApplyStatus } from "@/lib/db/video-store";
import { buildRealitySummary } from "@/lib/utils/reality-summary";
import { formatPointsLine, POINTS_LABELS } from "@/lib/db/points";
import type { PointsTransaction } from "@/lib/types/database";

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
