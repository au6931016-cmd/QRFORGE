import type { Metadata } from "next";
import { TemplateGallery } from "@/components/qr/TemplateGallery";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Container, Section } from "@/components/ui/Container";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "QR Code Templates & Tools",
  description:
    "Ready-made QR code templates for restaurant menus, Wi-Fi access, business cards, events, and more. Pick a template and it selects the right QR type automatically.",
  path: "/qr-tools",
});

export default function QrToolsPage() {
  return (
    <Section className="pt-8 sm:pt-10">
      <Container>
        <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "QR Tools", path: "/qr-tools" }]} />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-text sm:text-4xl">
          QR Code Templates
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-text-muted">
          Start from a ready-made template for common use cases. Each one pre-selects the right
          QR code type and a matching color style — you can still customize everything before
          downloading.
        </p>
        <div className="mt-10">
          <TemplateGallery />
        </div>
      </Container>
    </Section>
  );
}
