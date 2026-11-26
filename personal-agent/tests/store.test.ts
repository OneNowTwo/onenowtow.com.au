import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  applyFeedbackCommand,
  ensurePilotUser,
  getControls,
  PILOT_USER_ID,
} from "../src/server/store";

const dataDir = mkdtempSync(path.join(tmpdir(), "pa-store-"));

beforeAll(() => {
  process.env.PGLITE_DATA_DIR = dataDir;
  delete process.env.DATABASE_URL;
  globalThis.__personalAgentDb = undefined;
  globalThis.__personalAgentDbReady = undefined;
  globalThis.__personalAgentPglite = undefined;
});

afterAll(() => {
  rmSync(dataDir, { recursive: true, force: true });
});

describe("persistent controls", () => {
  it("survives pause via feedback and keeps revision", async () => {
    await ensurePilotUser();
    const before = await getControls(PILOT_USER_ID);
    const result = await applyFeedbackCommand({
      userId: PILOT_USER_ID,
      text: "pause",
      idempotencyKey: "test-pause-1",
    });
    expect(result.controls.paused).toBe(true);
    expect(result.controls.revision).toBe(before.revision + 1);

    const again = await applyFeedbackCommand({
      userId: PILOT_USER_ID,
      text: "pause",
      idempotencyKey: "test-pause-1",
    });
    expect(again.duplicate).toBe(true);
    expect(again.controls.revision).toBe(result.controls.revision);

    const less = await applyFeedbackCommand({
      userId: PILOT_USER_ID,
      text: "less of this",
      idempotencyKey: "test-less-1",
      topicHint: "food",
    });
    expect(less.kind).toBe("less_of_this");
  });
});
