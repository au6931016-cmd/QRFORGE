import type { Metadata } from "next";
import { QRTypePageTemplate } from "@/components/qr/QRTypePageTemplate";
import { qrTypeContent } from "@/data/qr-types/content";
import { buildMetadata } from "@/lib/seo/metadata";

const content = qrTypeContent.text;

export const metadata: Metadata = buildMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  path: "/qr-code-generator/text",
});

export default function TextQRCodePage() {
  return <QRTypePageTemplate type="text" />;
}
