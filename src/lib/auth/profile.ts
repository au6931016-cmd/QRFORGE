import type { Profile } from "@/types/database";

export function buildProfileRow(
  userId: string,
  email: string,
  existing?: Partial<Profile> | null,
): Pick<
  Profile,
  | "id"
  | "email"
  | "plan_tier"
  | "safepay_customer_id"
  | "safepay_subscription_id"
  | "subscription_status"
  | "plan_expires_at"
> {
  return {
    id: userId,
    email,
    plan_tier: existing?.plan_tier ?? "free",
    safepay_customer_id: existing?.safepay_customer_id ?? null,
    safepay_subscription_id: existing?.safepay_subscription_id ?? null,
    subscription_status: existing?.subscription_status ?? null,
    plan_expires_at: existing?.plan_expires_at ?? null,
  };
}
