import type { Metadata } from "next";
import { QRTypePageTemplate } from "@/components/qr/QRTypePageTemplate";
import { qrTypeContent } from "@/data/qr-types/content";
import { buildMetadata } from "@/lib/seo/metadata";

const content = qrTypeContent.location;

export const metadata: Metadata = buildMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  path: "/qr-code-generator/location",
});

export default function LocationQRCodePage() {
  return <QRTypePageTemplate type="location" />;
}
