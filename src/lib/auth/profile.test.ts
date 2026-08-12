import { describe, expect, it } from "vitest";
import { buildProfileRow } from "./profile";

describe("buildProfileRow", () => {
  it("creates a default free-tier profile row when the user has no profile yet", () => {
    expect(buildProfileRow("user-123", "user@example.com")).toEqual({
      id: "user-123",
      email: "user@example.com",
      plan_tier: "free",
      safepay_customer_id: null,
      safepay_subscription_id: null,
      subscription_status: null,
      plan_expires_at: null,
    });
  });

  it("preserves an existing pro profile when rehydrating a user row", () => {
    expect(
      buildProfileRow("user-123", "user@example.com", {
        id: "user-123",
        email: "user@example.com",
        plan_tier: "pro",
        safepay_customer_id: null,
        safepay_subscription_id: null,
        subscription_status: "active",
        plan_expires_at: "2026-12-31T00:00:00.000Z",
      }),
    ).toEqual({
      id: "user-123",
      email: "user@example.com",
      plan_tier: "pro",
      safepay_customer_id: null,
      safepay_subscription_id: null,
      subscription_status: "active",
      plan_expires_at: "2026-12-31T00:00:00.000Z",
    });
  });
});
