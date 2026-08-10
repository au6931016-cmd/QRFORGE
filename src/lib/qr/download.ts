import type { Options } from "qr-code-styling";
import { composeFramedPng, composeFramedSvg, triggerBlobDownload } from "@/lib/qr/compose";
import type { DownloadFormat, QRCustomization } from "@/types/qr";

export function slugifyFilename(name: string): string {
  return (
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "qr-code"
  );
}

/**
 * Renders a one-off, non-mounted qr-code-styling instance at the requested
 * export size and triggers a browser download. Kept independent from the
 * live preview instance so export resolution never affects on-screen size.
 *
 * When a "Scan me" frame or caption label is enabled, that text only ever
 * exists as DOM overlay in the live preview — it is baked into the actual
 * downloaded file here so what the user sees is what they get.
 */
export async function downloadQRCode(
  options: Partial<Options>,
  format: DownloadFormat,
  filenameBase: string,
  customization: QRCustomization,
): Promise<void> {
  const { default: QRCodeStyling } = await import("qr-code-styling");
  const instance = new QRCodeStyling(options);
  const filename = `${slugifyFilename(filenameBase)}-qr-code`;

  const needsComposition = customization.frameEnabled || customization.label.trim().length > 0;
  if (!needsComposition) {
    await instance.download({ name: filename, extension: format });
    return;
  }

  const size = typeof options.width === "number" ? options.width : 600;
  const rawData = await instance.getRawData(format);
  if (!rawData) throw new Error("Failed to generate the QR code image.");
  // getRawData() only returns a Buffer in Node; this module only ever runs
  // in the browser (dynamically imported), so this branch is unreachable —
  // the cast just satisfies the shared Blob/Buffer return type.
  const rawBlob = rawData instanceof Blob ? rawData : new Blob([rawData as unknown as BlobPart]);

  const frame = {
    frameEnabled: customization.frameEnabled,
    frameLabel: customization.frameLabel,
    label: customization.label,
  };
  const composed =
    format === "png"
      ? await composeFramedPng(rawBlob, size, frame)
      : await composeFramedSvg(rawBlob, size, frame);

  triggerBlobDownload(composed, `${filename}.${format}`);
}
