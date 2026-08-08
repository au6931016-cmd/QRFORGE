import type { Metadata } from "next";
import { QRTypePageTemplate } from "@/components/qr/QRTypePageTemplate";
import { qrTypeContent } from "@/data/qr-types/content";
import { buildMetadata } from "@/lib/seo/metadata";

const content = qrTypeContent.wifi;

export const metadata: Metadata = buildMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  path: "/qr-code-generator/wifi",
});

export default function WifiQRCodePage() {
  return <QRTypePageTemplate type="wifi" />;
}
