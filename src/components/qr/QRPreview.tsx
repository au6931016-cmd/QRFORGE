"use client";

import { useMemo } from "react";
import { useQRCodeStyling } from "@/hooks/useQRCodeStyling";
import { buildQRStylingOptions } from "@/lib/qr/build-options";
import { cn } from "@/lib/utils/cn";
import type { QRCustomization } from "@/types/qr";

const PREVIEW_SIZE = 260;

interface QRPreviewProps {
  data: string;
  customization: QRCustomization;
  className?: string;
}

export function QRPreview({ data, customization, className }: QRPreviewProps) {
  const hasData = data.trim().length > 0;

  const options = useMemo(
    () => buildQRStylingOptions(hasData ? data : " ", customization, PREVIEW_SIZE),
    [data, customization, hasData],
  );

  const { containerRef, ready } = useQRCodeStyling(options);

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div
        className={cn(
          "relative flex items-center justify-center rounded-xl border border-border bg-white p-6 shadow-sm",
          customization.frameEnabled && "pb-4 pt-6",
        )}
      >
        <div className="relative" style={{ width: PREVIEW_SIZE, height: PREVIEW_SIZE }}>
          {!hasData && (
            <div className="absolute inset-0 flex items-center justify-center rounded-md border border-dashed border-border bg-surface text-center text-xs text-text-muted">
              Fill in the form to see your QR code
            </div>
          )}
          <div
            ref={containerRef}
            aria-label="QR code preview"
            role="img"
            className={cn(!ready || !hasData ? "invisible" : "visible")}
          />
        </div>
        {customization.frameEnabled && hasData && (
          <p className="absolute inset-x-0 bottom-1 text-center text-sm font-bold tracking-wide text-text">
            {customization.frameLabel || "SCAN ME"}
          </p>
        )}
      </div>
      {customization.label && hasData && (
        <p className="text-center text-sm font-medium text-text-muted">{customization.label}</p>
      )}
    </div>
  );
}
