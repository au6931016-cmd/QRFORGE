"use client";

import { useId, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import type {
  CornerDotStyle,
  CornerSquareStyle,
  DotStyle,
  QRCustomization,
} from "@/types/qr";

interface CustomizationPanelProps {
  value: QRCustomization;
  onChange: (next: QRCustomization) => void;
}

const DOT_STYLES: { label: string; value: DotStyle }[] = [
  { label: "Square", value: "square" },
  { label: "Dots", value: "dots" },
  { label: "Rounded", value: "rounded" },
  { label: "Classy", value: "classy" },
  { label: "Classy rounded", value: "classy-rounded" },
  { label: "Extra rounded", value: "extra-rounded" },
];

const CORNER_SQUARE_STYLES: { label: string; value: CornerSquareStyle }[] = [
  { label: "Square", value: "square" },
  { label: "Dot", value: "dot" },
  { label: "Extra rounded", value: "extra-rounded" },
];

const CORNER_DOT_STYLES: { label: string; value: CornerDotStyle }[] = [
  { label: "Square", value: "square" },
  { label: "Dot", value: "dot" },
];

const MAX_LOGO_BYTES = 2 * 1024 * 1024;

export function CustomizationPanel({ value, onChange }: CustomizationPanelProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const uid = useId();
  const [logoError, setLogoError] = useState<string | null>(null);

  function update<K extends keyof QRCustomization>(key: K, next: QRCustomization[K]) {
    onChange({ ...value, [key]: next });
  }

  function handleLogoUpload(file: File | undefined) {
    setLogoError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setLogoError("Please choose an image file (PNG, JPG, or SVG).");
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      setLogoError("Logo image must be smaller than 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      update("logo", { ...value.logo, dataUrl: reader.result as string });
    };
    reader.onerror = () => setLogoError("Could not read that image. Try a different file.");
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-8">
      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-text">Colors</legend>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`${uid}-fg`}>Foreground</Label>
            <ColorInput
              id={`${uid}-fg`}
              value={value.foregroundColor}
              onChange={(color) => update("foregroundColor", color)}
            />
          </div>
          <div>
            <Label htmlFor={`${uid}-bg`}>Background</Label>
            <ColorInput
              id={`${uid}-bg`}
              value={value.backgroundColor}
              onChange={(color) => update("backgroundColor", color)}
            />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Checkbox
            id={`${uid}-gradient`}
            checked={value.useGradient}
            onChange={(e) => update("useGradient", e.target.checked)}
          />
          <Label htmlFor={`${uid}-gradient`} className="mb-0">
            Use gradient
          </Label>
        </div>
        {value.useGradient && (
          <div className="mt-3">
            <Label htmlFor={`${uid}-gradient-color`}>Gradient end color</Label>
            <ColorInput
              id={`${uid}-gradient-color`}
              value={value.gradientColor}
              onChange={(color) => update("gradientColor", color)}
            />
          </div>
        )}
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-text">Style</legend>
        <div className="grid gap-4">
          <div>
            <Label htmlFor={`${uid}-dot-style`}>Module shape</Label>
            <Select
              id={`${uid}-dot-style`}
              value={value.dotStyle}
              onChange={(e) => update("dotStyle", e.target.value as DotStyle)}
            >
              {DOT_STYLES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor={`${uid}-corner-square`}>Eye (corner) style</Label>
            <Select
              id={`${uid}-corner-square`}
              value={value.cornerSquareStyle}
              onChange={(e) => update("cornerSquareStyle", e.target.value as CornerSquareStyle)}
            >
              {CORNER_SQUARE_STYLES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor={`${uid}-corner-dot`}>Eye center style</Label>
            <Select
              id={`${uid}-corner-dot`}
              value={value.cornerDotStyle}
              onChange={(e) => update("cornerDotStyle", e.target.value as CornerDotStyle)}
            >
              {CORNER_DOT_STYLES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-text">Logo</legend>
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            id={`${uid}-logo-upload`}
            onChange={(e) => handleLogoUpload(e.target.files?.[0])}
          />
          <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            Upload logo
          </Button>
          {value.logo.dataUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => update("logo", { ...value.logo, dataUrl: null })}
            >
              Remove
            </Button>
          )}
        </div>
        {logoError && (
          <p role="alert" className="mt-2 text-xs font-medium text-danger">
            {logoError}
          </p>
        )}
        {value.logo.dataUrl && (
          <div className="mt-4 space-y-3">
            <div>
              <Label htmlFor={`${uid}-logo-size`}>Logo size</Label>
              <input
                id={`${uid}-logo-size`}
                type="range"
                min={0.1}
                max={0.35}
                step={0.01}
                value={value.logo.sizeRatio}
                onChange={(e) =>
                  update("logo", { ...value.logo, sizeRatio: Number(e.target.value) })
                }
                className="w-full accent-primary"
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id={`${uid}-hide-bg-dots`}
                checked={value.logo.hideBackgroundDots}
                onChange={(e) =>
                  update("logo", { ...value.logo, hideBackgroundDots: e.target.checked })
                }
              />
              <Label htmlFor={`${uid}-hide-bg-dots`} className="mb-0">
                Clear space behind logo
              </Label>
            </div>
          </div>
        )}
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-text">Frame &amp; label</legend>
        <div className="flex items-center gap-2">
          <Checkbox
            id={`${uid}-frame`}
            checked={value.frameEnabled}
            onChange={(e) => update("frameEnabled", e.target.checked)}
          />
          <Label htmlFor={`${uid}-frame`} className="mb-0">
            Add &ldquo;Scan me&rdquo; frame
          </Label>
        </div>
        {value.frameEnabled && (
          <div className="mt-3">
            <Label htmlFor={`${uid}-frame-label`}>Frame text</Label>
            <Input
              id={`${uid}-frame-label`}
              value={value.frameLabel}
              maxLength={30}
              onChange={(e) => update("frameLabel", e.target.value)}
            />
          </div>
        )}
        <div className="mt-3">
          <Label htmlFor={`${uid}-label`}>Caption below QR code (optional)</Label>
          <Input
            id={`${uid}-label`}
            value={value.label}
            maxLength={60}
            placeholder="e.g. Visit our menu"
            onChange={(e) => update("label", e.target.value)}
          />
        </div>
      </fieldset>
    </div>
  );
}

function ColorInput({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        aria-label="Pick color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-11 shrink-0 cursor-pointer rounded-md border border-border bg-bg p-1"
      />
      <Input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="font-mono text-xs"
      />
    </div>
  );
}
