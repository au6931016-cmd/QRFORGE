"use client";

import { qrTypeMeta } from "@/data/qr-types/meta";
import { QR_CODE_TYPES } from "@/types/qr";
import type { QRCodeType } from "@/types/qr";
import { cn } from "@/lib/utils/cn";

interface QRTypeSelectorProps {
  value: QRCodeType;
  onChange: (type: QRCodeType) => void;
}

const SELECTED_TONE_CLASSES = [
  "border-primary bg-primary/10 text-primary",
  "border-accent-violet bg-accent-violet/10 text-accent-violet",
  "border-accent-teal bg-accent-teal/10 text-accent-teal",
  "border-accent-rose bg-accent-rose/10 text-accent-rose",
  "border-accent-amber bg-accent-amber/10 text-accent-amber",
  "border-accent bg-accent/10 text-accent",
];

export function QRTypeSelector({ value, onChange }: QRTypeSelectorProps) {
  return (
    <div
      role="radiogroup"
      aria-label="QR code type"
      className="grid grid-cols-3 gap-2 sm:grid-cols-5"
    >
      {QR_CODE_TYPES.map((type, index) => {
        const meta = qrTypeMeta[type];
        const selected = type === value;
        return (
          <button
            key={type}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(type)}
            className={cn(
              "rounded-md border px-2 py-2.5 text-center text-xs font-medium transition-colors",
              selected
                ? SELECTED_TONE_CLASSES[index % SELECTED_TONE_CLASSES.length]
                : "border-border text-text-muted hover:bg-surface hover:text-text",
            )}
          >
            {meta.shortLabel}
          </button>
        );
      })}
    </div>
  );
}
