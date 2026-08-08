/**
 * Centralized AdSense placement configuration.
 *
 * No AdSense code is wired in yet — this only controls whether reserved
 * AdSlot placements render, and where. Flip `enabled` once an approved
 * AdSense account and NEXT_PUBLIC_ADSENSE_CLIENT_ID are in place.
 */
export const adsConfig = {
  enabled: process.env.NEXT_PUBLIC_ADS_ENABLED === "true",
  // Never show ads in development unless explicitly opted in above.
  showInDevelopment: false,
  clientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? "",
  placements: {
    articleTop: true,
    articleMiddle: true,
    articleBottom: true,
    articleSidebar: true,
    toolBottom: true,
  },
} as const;

export function isAdSlotEnabled(): boolean {
  if (!adsConfig.enabled) return false;
  if (process.env.NODE_ENV === "development" && !adsConfig.showInDevelopment) {
    return false;
  }
  return true;
}

export type AdPlacement = keyof typeof adsConfig.placements;
