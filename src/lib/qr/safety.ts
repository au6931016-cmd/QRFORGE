import type { QRCustomization } from "@/types/qr";

export interface SafetyWarning {
  id: string;
  message: string;
  severity: "warning" | "info";
}

function hexToRgb(hex: string): [number, number, number] | null {
  const normalized = hex.trim().replace("#", "");
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((c) => c + c)
          .join("")
      : normalized;
  if (!/^[0-9a-f]{6}$/i.test(full)) return null;
  const num = parseInt(full, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const channel = (value: number) => {
    const c = value / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** WCAG-style contrast ratio between two hex colors, from 1 (none) to 21 (max). */
export function contrastRatio(hexA: string, hexB: string): number {
  const rgbA = hexToRgb(hexA);
  const rgbB = hexToRgb(hexB);
  if (!rgbA || !rgbB) return 21;
  const lumA = relativeLuminance(rgbA);
  const lumB = relativeLuminance(rgbB);
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return (lighter + 0.05) / (darker + 0.05);
}

const MIN_SCAN_SAFE_CONTRAST = 3.5;
const MIN_RECOMMENDED_SIZE_PX = 200;
const MAX_LOGO_SIZE_RATIO = 0.25;

export function evaluateQRSafety(
  customization: QRCustomization,
  sizePx: number,
): SafetyWarning[] {
  const warnings: SafetyWarning[] = [];

  const foreground = customization.useGradient
    ? customization.gradientColor
    : customization.foregroundColor;
  const ratio = contrastRatio(foreground, customization.backgroundColor);
  if (ratio < MIN_SCAN_SAFE_CONTRAST) {
    warnings.push({
      id: "contrast",
      message: "Low contrast may reduce QR-code scan reliability.",
      severity: "warning",
    });
  }

  if (sizePx < MIN_RECOMMENDED_SIZE_PX) {
    warnings.push({
      id: "size",
      message: `QR codes smaller than ${MIN_RECOMMENDED_SIZE_PX}px may be difficult for some scanners to read, especially when printed.`,
      severity: "warning",
    });
  }

  if (customization.logo.dataUrl && customization.logo.sizeRatio > MAX_LOGO_SIZE_RATIO) {
    warnings.push({
      id: "logo-size",
      message: "Large logos may make this QR code harder to scan.",
      severity: "warning",
    });
  }

  if (customization.logo.dataUrl) {
    warnings.push({
      id: "logo-general",
      message: "Test this QR code with multiple devices before printing.",
      severity: "info",
    });
  }

  return warnings;
}
