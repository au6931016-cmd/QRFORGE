import type { QRCodeType, QRCustomization } from "@/types/qr";

export type PlanTier = "free" | "pro";
export type SubscriptionStatus = "active" | "past_due" | "canceled" | "trialing";

export interface Profile {
  id: string;
  email: string;
  plan_tier: PlanTier;
  safepay_customer_id: string | null;
  safepay_subscription_id: string | null;
  subscription_status: SubscriptionStatus | null;
  plan_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface QRCodeRow {
  id: string;
  user_id: string;
  type: QRCodeType;
  name: string;
  form_data: Record<string, unknown>;
  customization: QRCustomization;
  is_dynamic: boolean;
  short_code: string | null;
  destination_url: string | null;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface QRScanRow {
  id: number;
  qr_code_id: string;
  scanned_at: string;
  referrer: string | null;
  user_agent: string | null;
}
