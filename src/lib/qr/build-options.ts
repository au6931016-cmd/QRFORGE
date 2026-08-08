import type { Options } from "qr-code-styling";
import type { QRCustomization } from "@/types/qr";

/**
 * Translates our app-level customization model into qr-code-styling's
 * options shape. Single source of truth so the live preview and the
 * download/export path can never drift apart.
 */
export function buildQRStylingOptions(
  data: string,
  customization: QRCustomization,
  size: number,
): Partial<Options> {
  const dotsColor = customization.useGradient
    ? undefined
    : customization.foregroundColor;
  const dotsGradient = customization.useGradient
    ? {
        type: "linear" as const,
        rotation: 45,
        colorStops: [
          { offset: 0, color: customization.foregroundColor },
          { offset: 1, color: customization.gradientColor },
        ],
      }
    : undefined;

  return {
    width: size,
    height: size,
    data,
    margin: 8,
    qrOptions: {
      errorCorrectionLevel: customization.logo.dataUrl ? "H" : "M",
    },
    dotsOptions: {
      type: customization.dotStyle,
      color: dotsColor,
      gradient: dotsGradient,
    },
    cornersSquareOptions: {
      type: customization.cornerSquareStyle,
      color: customization.foregroundColor,
    },
    cornersDotOptions: {
      type: customization.cornerDotStyle,
      color: customization.foregroundColor,
    },
    backgroundOptions: {
      color: customization.backgroundColor,
    },
    image: customization.logo.dataUrl ?? undefined,
    imageOptions: {
      imageSize: customization.logo.sizeRatio,
      hideBackgroundDots: customization.logo.hideBackgroundDots,
      margin: 4,
    },
  };
}
