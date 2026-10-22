import { describe, expect, it } from "vitest";
import { parseFeedback } from "../src/domain/feedback";

const now = new Date("2026-10-14T01:00:00.000Z");

describe("feedback parsing", () => {
  it("pauses immediately on stop", () => {
    const cmd = parseFeedback("stop", { now });
    expect(cmd.kind).toBe("pause");
    expect(cmd.acknowledgement).toMatch(/Paused/i);
  });

  it("reduces only the identified topic for less of this", () => {
    const cmd = parseFeedback("less of this", { now, topicHint: "food" });
    expect(cmd.kind).toBe("less_of_this");
    expect(cmd.preference?.topic).toBe("food");
    expect(cmd.preference?.polarity).toBe("reduce");
    expect(cmd.acknowledgement).toMatch(/food/i);
  });

  it("keeps flat mood temporary", () => {
    const cmd = parseFeedback("I'm flat today", { now });
    expect(cmd.kind).toBe("flat_today");
    expect(cmd.preference?.expiresAt).toBeTruthy();
    expect(cmd.preference?.note).toBe("temporary_flat_mood");
  });

  it("schedules remind me Friday", () => {
    const cmd = parseFeedback("remind me Friday", { now });
    expect(cmd.kind).toBe("remind_me");
    expect(cmd.resolvedAt).toBeTruthy();
  });

  it("resumes without backlog language", () => {
    const cmd = parseFeedback("resume", { now });
    expect(cmd.kind).toBe("resume");
    expect(cmd.acknowledgement).toMatch(/Back on/i);
  });
});
