import { siteConfig } from "@/config/site";
import { buildQRStylingOptions } from "@/lib/qr/build-options";
import { downloadQRCode } from "@/lib/qr/download";
import { buildQRPayload } from "@/lib/qr/encode";
import type { QRCodeRow } from "@/types/database";

/** The literal string a saved QR code's image encodes — the same rule QRDetailView uses. */
export function getSavedQrPayload(qrCode: QRCodeRow): string {
  return qrCode.is_dynamic
    ? `${siteConfig.url}/r/${qrCode.short_code}`
    : buildQRPayload(qrCode.type, qrCode.form_data as never);
}

/** One-click PNG download for a saved QR code, for list/history rows. */
export async function downloadSavedQrCode(qrCode: QRCodeRow): Promise<void> {
  const payload = getSavedQrPayload(qrCode);
  const options = buildQRStylingOptions(payload, qrCode.customization, 600);
  await downloadQRCode(options, "png", qrCode.name || qrCode.type, qrCode.customization);
}
