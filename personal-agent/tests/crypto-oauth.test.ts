import { describe, expect, it } from "vitest";
import { decryptSecret, encryptSecret } from "../src/server/crypto";
import { newOAuthState, parseOAuthState } from "../src/server/google-oauth";

describe("token encryption", () => {
  it("round-trips secrets", () => {
    process.env.TOKEN_ENCRYPTION_KEY = "test-key-for-unit-tests-only";
    const packed = encryptSecret(JSON.stringify({ refresh_token: "abc" }));
    expect(packed.startsWith("v1.")).toBe(true);
    expect(JSON.parse(decryptSecret(packed))).toEqual({ refresh_token: "abc" });
  });
});

describe("oauth state", () => {
  it("signs and verifies state payloads", () => {
    process.env.SESSION_SECRET = "state-secret";
    const state = newOAuthState({ purpose: "login", returnTo: "/connections" });
    const parsed = parseOAuthState(state);
    expect(parsed?.purpose).toBe("login");
    expect(parsed?.returnTo).toBe("/connections");
    expect(parseOAuthState(state.slice(0, -2) + "xx")).toBeNull();
  });
});
