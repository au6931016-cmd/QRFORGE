import type { Metadata } from "next";
import { QRTypePageTemplate } from "@/components/qr/QRTypePageTemplate";
import { qrTypeContent } from "@/data/qr-types/content";
import { buildMetadata } from "@/lib/seo/metadata";

const content = qrTypeContent.sms;

export const metadata: Metadata = buildMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  path: "/qr-code-generator/sms",
});

export default function SmsQRCodePage() {
  return <QRTypePageTemplate type="sms" />;
}
