"use client";

import type { QRCodeType } from "@/types/qr";

/**
 * Thin, provider-agnostic analytics abstraction. Nothing in the app should
 * import a vendor SDK (Google Analytics, Plausible, etc.) directly — route
 * everything through here so the provider can be swapped, and so tracking
 * can be disabled globally without touching call sites.
 *
 * Wire a real provider by replacing `dispatch()`. Until then, events are
 * only logged in development for debugging.
 */

const ANALYTICS_ENABLED = process.env.NEXT_PUBLIC_ANALYTICS_ID
  ? process.env.NEXT_PUBLIC_ANALYTICS_ID.length > 0
  : false;

export interface AnalyticsEvent {
  name: string;
  params?: Record<string, string | number | boolean>;
}

function dispatch(event: AnalyticsEvent): void {
  if (!ANALYTICS_ENABLED) {
    if (process.env.NODE_ENV === "development") {
      console.debug("[analytics]", event.name, event.params ?? {});
    }
    return;
  }

  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === "function") {
    gtag("event", event.name, event.params ?? {});
  }
}

export function trackEvent(name: string, params?: AnalyticsEvent["params"]): void {
  dispatch({ name, params });
}

export function trackQRGenerated(type: QRCodeType): void {
  trackEvent("qr_generated", { qr_type: type });
}

export function trackQRDownloaded(type: QRCodeType, format: string): void {
  trackEvent("qr_downloaded", { qr_type: type, format });
}

export function trackQRPrinted(type: QRCodeType): void {
  trackEvent("qr_printed", { qr_type: type });
}

export function trackTemplateSelected(templateId: string): void {
  trackEvent("template_selected", { template_id: templateId });
}
