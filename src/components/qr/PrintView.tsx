"use client";

import { useMemo } from "react";
import { useQRCodeStyling } from "@/hooks/useQRCodeStyling";
import { buildQRStylingOptions } from "@/lib/qr/build-options";
import type { QRCustomization } from "@/types/qr";

const PRINT_SIZE = 480;

interface PrintViewProps {
  data: string;
  customization: QRCustomization;
  title: string;
  description?: string;
}

/**
 * Rendered off-screen at all times; only becomes visible via the
 * `@media print` rules in globals.css targeting #print-area. Kept free of
 * navigation, ads, and any other chrome — printed output must contain only
 * the QR code and its supporting info, per policy (ads must never appear
 * in printed output).
 */
export function PrintView({ data, customization, title, description }: PrintViewProps) {
  const options = useMemo(
    () => buildQRStylingOptions(data || " ", customization, PRINT_SIZE),
    [data, customization],
  );
  const { containerRef } = useQRCodeStyling(options);

  return (
    <div id="print-area" className="hidden print:block">
      <div className="flex flex-col items-center gap-6 p-12 text-center">
        <h1 className="text-2xl font-bold text-black">{title}</h1>
        {description && <p className="max-w-md text-sm text-black">{description}</p>}
        <div ref={containerRef} />
        {customization.frameEnabled && (
          <p className="text-lg font-bold tracking-wide text-black">
            {customization.frameLabel || "SCAN ME"}
          </p>
        )}
        {customization.label && <p className="text-base font-medium text-black">{customization.label}</p>}
        <p className="mt-4 text-xs text-black">
          Scan with your phone&apos;s camera app. Test this QR code before printing in bulk.
        </p>
      </div>
    </div>
  );
}
