import { describe, expect, it } from "vitest";
import { contrastRatio, evaluateQRSafety } from "@/lib/qr/safety";
import { DEFAULT_CUSTOMIZATION } from "@/types/qr";

describe("contrastRatio", () => {
  it("returns the maximum ratio for black on white", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 0);
  });

  it("returns 1 for identical colors", () => {
    expect(contrastRatio("#336699", "#336699")).toBeCloseTo(1, 5);
  });

  it("is symmetric regardless of argument order", () => {
    const a = contrastRatio("#111111", "#eeeeee");
    const b = contrastRatio("#eeeeee", "#111111");
    expect(a).toBeCloseTo(b, 5);
  });
});

describe("evaluateQRSafety", () => {
  it("warns about low contrast", () => {
    const warnings = evaluateQRSafety(
      { ...DEFAULT_CUSTOMIZATION, foregroundColor: "#eeeeee", backgroundColor: "#ffffff" },
      600,
    );
    expect(warnings.some((w) => w.id === "contrast")).toBe(true);
  });

  it("does not warn about contrast for a safely dark-on-light combination", () => {
    const warnings = evaluateQRSafety(
      { ...DEFAULT_CUSTOMIZATION, foregroundColor: "#000000", backgroundColor: "#ffffff" },
      600,
    );
    expect(warnings.some((w) => w.id === "contrast")).toBe(false);
  });

  it("warns about small sizes", () => {
    const warnings = evaluateQRSafety(DEFAULT_CUSTOMIZATION, 100);
    expect(warnings.some((w) => w.id === "size")).toBe(true);
  });

  it("warns about oversized logos but not small ones", () => {
    const withLargeLogo = evaluateQRSafety(
      {
        ...DEFAULT_CUSTOMIZATION,
        logo: { dataUrl: "data:image/png;base64,abc", sizeRatio: 0.35, hideBackgroundDots: true },
      },
      600,
    );
    expect(withLargeLogo.some((w) => w.id === "logo-size")).toBe(true);

    const withSmallLogo = evaluateQRSafety(
      {
        ...DEFAULT_CUSTOMIZATION,
        logo: { dataUrl: "data:image/png;base64,abc", sizeRatio: 0.15, hideBackgroundDots: true },
      },
      600,
    );
    expect(withSmallLogo.some((w) => w.id === "logo-size")).toBe(false);
  });

  it("never claims perfect scan reliability anywhere in warning text", () => {
    const warnings = evaluateQRSafety(DEFAULT_CUSTOMIZATION, 100);
    for (const warning of warnings) {
      expect(warning.message.toLowerCase()).not.toContain("100%");
      expect(warning.message.toLowerCase()).not.toContain("guarantee");
    }
  });
});
