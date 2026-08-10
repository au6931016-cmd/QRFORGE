"use client";

import { adsConfig, isAdSlotEnabled, type AdPlacement } from "@/config/ads";
import { useAuth } from "@/components/auth/AuthContext";
import { useConsent } from "@/components/privacy/ConsentContext";
import { cn } from "@/lib/utils/cn";

interface AdSlotProps {
  placement: AdPlacement;
  className?: string;
  /** Reserved space to avoid layout shift, even before ads load. */
  minHeight?: number;
}

/**
 * Reserved ad placement. No AdSense script is loaded by this component —
 * it only renders a labeled, visually-distinct placeholder when ads are
 * enabled, the placement is turned on, the visitor has consented to
 * advertising, and they aren't a Pro subscriber. Wire real AdSense units
 * here once an approved account and NEXT_PUBLIC_ADSENSE_CLIENT_ID are
 * available.
 */
export function AdSlot({ placement, className, minHeight = 250 }: AdSlotProps) {
  const { advertising } = useConsent();
  const { isPro } = useAuth();

  if (!isAdSlotEnabled()) return null;
  if (!adsConfig.placements[placement]) return null;
  if (!advertising) return null;
  // isPro is false while the session is still loading — that means a Pro
  // visitor may see one ad flash briefly on first paint, which is a better
  // tradeoff than hiding ads for everyone during that window.
  if (isPro) return null;

  return (
    <div
      className={cn(
        "flex w-full items-center justify-center rounded-md border border-dashed border-border bg-surface text-xs text-text-muted",
        className,
      )}
      style={{ minHeight }}
      data-ad-placement={placement}
      aria-label="Advertisement"
    >
      Advertisement
    </div>
  );
}
