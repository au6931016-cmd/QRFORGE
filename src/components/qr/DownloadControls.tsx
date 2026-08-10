"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { trackQRDownloaded, trackQRPrinted } from "@/lib/analytics";
import { buildQRStylingOptions } from "@/lib/qr/build-options";
import { downloadQRCode } from "@/lib/qr/download";
import { QR_SIZE_PRESETS } from "@/types/qr";
import type { DownloadFormat, QRCodeType, QRCustomization, QRSizePreset } from "@/types/qr";
import { cn } from "@/lib/utils/cn";

interface DownloadControlsProps {
  data: string;
  customization: QRCustomization;
  type: QRCodeType;
  filenameBase: string;
  onPrint: () => void;
  onReset?: () => void;
}

const SIZE_OPTIONS: { label: string; value: QRSizePreset }[] = [
  { label: "Small (300px)", value: "small" },
  { label: "Medium (600px)", value: "medium" },
  { label: "Large (1000px)", value: "large" },
  { label: "Custom", value: "custom" },
];

export function DownloadControls({
  data,
  customization,
  type,
  filenameBase,
  onPrint,
  onReset,
}: DownloadControlsProps) {
  const [sizePreset, setSizePreset] = useState<QRSizePreset>("medium");
  const [customSize, setCustomSize] = useState(800);
  const [downloading, setDownloading] = useState<DownloadFormat | null>(null);
  // Starts false to match the server-rendered HTML (no `navigator` there),
  // then flips on after mount if the browser actually supports Web Share.
  // Checking this during initial render would mismatch server vs. client.
  const [shareSupported, setShareSupported] = useState(false);

  useEffect(() => {
    // Must run post-hydration: `navigator` availability/shape can only be
    // checked safely on the client, and doing it during render would
    // mismatch the server-rendered HTML (see comment above).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShareSupported(typeof navigator.share === "function");
  }, []);

  const hasData = data.trim().length > 0;
  const resolvedSize = sizePreset === "custom" ? customSize : QR_SIZE_PRESETS[sizePreset];

  async function handleDownload(format: DownloadFormat) {
    if (!hasData || downloading) return;
    setDownloading(format);
    try {
      const options = buildQRStylingOptions(data, customization, resolvedSize);
      await downloadQRCode(options, format, filenameBase, customization);
      trackQRDownloaded(type, format);
    } catch {
      // Swallow — the browser download dialog itself is the confirmation;
      // a failed export simply produces no file, which is self-evident.
    } finally {
      setDownloading(null);
    }
  }

  async function handleShare() {
    if (!hasData) return;
    try {
      const { default: QRCodeStyling } = await import("qr-code-styling");
      const options = buildQRStylingOptions(data, customization, 600);
      const instance = new QRCodeStyling(options);
      const blob = (await instance.getRawData("png")) as Blob | null;
      if (!blob) return;
      const file = new File([blob], `${filenameBase}-qr-code.png`, { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "QR Code" });
      }
    } catch {
      // User cancelled the share sheet or sharing failed silently — no
      // action needed.
    }
  }

  function handlePrintClick() {
    trackQRPrinted(type);
    onPrint();
  }

  return (
    <div className="space-y-5">
      <div>
        <Label htmlFor="qr-size">Download size</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {SIZE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSizePreset(opt.value)}
              className={cn(
                "rounded-md border px-3 py-2 text-xs font-medium transition-colors",
                sizePreset === opt.value
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border text-text-muted hover:bg-surface",
              )}
              aria-pressed={sizePreset === opt.value}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {sizePreset === "custom" && (
          <div className="mt-2 flex items-center gap-2">
            <Input
              id="qr-size"
              type="number"
              min={100}
              max={4000}
              value={customSize}
              onChange={(e) => setCustomSize(Number(e.target.value) || 100)}
              className="w-32"
            />
            <span className="text-sm text-text-muted">px</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button disabled={!hasData || downloading !== null} onClick={() => handleDownload("png")}>
          {downloading === "png" ? "Preparing…" : "Download PNG"}
        </Button>
        <Button
          variant="secondary"
          disabled={!hasData || downloading !== null}
          onClick={() => handleDownload("svg")}
        >
          {downloading === "svg" ? "Preparing…" : "Download SVG"}
        </Button>
        <Button variant="outline" disabled={!hasData} onClick={handlePrintClick}>
          Print
        </Button>
        {shareSupported && (
          <Button variant="outline" disabled={!hasData} onClick={handleShare}>
            Share
          </Button>
        )}
        {onReset && (
          <Button variant="ghost" onClick={onReset}>
            Reset
          </Button>
        )}
      </div>

      <p className="text-xs text-text-muted">
        QR codes are generated in your browser. Scan reliability can vary by device and
        printer — always test before wide use.
      </p>
    </div>
  );
}
