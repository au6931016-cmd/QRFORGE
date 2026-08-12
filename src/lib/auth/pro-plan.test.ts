import { describe, expect, it } from "vitest";
import { isProfilePro } from "./pro-plan";

describe("isProfilePro", () => {
  it("returns true for an active pro profile that has not expired", () => {
    expect(
      isProfilePro({
        plan_tier: "pro",
        plan_expires_at: "2099-12-31T00:00:00.000Z",
      }),
    ).toBe(true);
  });

  it("returns false for a free profile or an expired pro plan", () => {
    expect(isProfilePro({ plan_tier: "free", plan_expires_at: null })).toBe(false);
    expect(
      isProfilePro({
        plan_tier: "pro",
        plan_expires_at: "2000-01-01T00:00:00.000Z",
      }),
    ).toBe(false);
  });
});
