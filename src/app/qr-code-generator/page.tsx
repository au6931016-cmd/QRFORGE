import type { Metadata } from "next";
import Link from "next/link";
import { QRCodeGenerator } from "@/components/qr/QRCodeGenerator";
import { AdSlot } from "@/components/ads/AdSlot";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Container, Section } from "@/components/ui/Container";
import { qrTypeMeta } from "@/data/qr-types/meta";
import { QR_CODE_TYPES } from "@/types/qr";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Free QR Code Generator",
  description:
    "Create custom QR codes for URLs, Wi-Fi, contact cards, events, and more. Free, fast, and generated entirely in your browser.",
  path: "/qr-code-generator",
});

export default function QRCodeGeneratorPage() {
  return (
    <>
      <Section className="pb-0 pt-8 sm:pt-10">
        <Container>
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "QR Generator", path: "/qr-code-generator" },
            ]}
          />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-text sm:text-4xl">
            QR Code Generator
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-text-muted">
            Choose a QR code type below, fill in the details, and customize the look. Your QR
            code updates live and downloads instantly — nothing leaves your browser.
          </p>
        </Container>
      </Section>

      <Section className="pt-8">
        <Container>
          <QRCodeGenerator />
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <AdSlot placement="toolBottom" />
        </Container>
      </Section>

      <Section className="border-t border-border bg-surface/50">
        <Container>
          <h2 className="text-xl font-semibold text-text">Browse by QR code type</h2>
          <p className="mt-2 max-w-2xl text-sm text-text-muted">
            Each type has its own dedicated page with detailed instructions, common mistakes to
            avoid, and answers to frequently asked questions.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {QR_CODE_TYPES.map((type) => {
              const meta = qrTypeMeta[type];
              return (
                <Link
                  key={type}
                  href={`/qr-code-generator/${type}`}
                  className="rounded-lg border border-border bg-bg p-5 transition-colors hover:border-primary"
                >
                  <h3 className="font-semibold text-text">{meta.label}</h3>
                  <p className="mt-1.5 text-sm text-text-muted">{meta.description}</p>
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="max-w-3xl">
          <h2 className="text-xl font-semibold text-text">Static vs. dynamic QR codes</h2>
          <p className="mt-3 text-sm leading-relaxed text-text-muted">
            Every QR code created here is a <strong>static</strong> QR code: the destination or
            data is encoded directly into the pattern itself, and it generally cannot be edited
            after the code is generated or printed. This makes static codes ideal for content
            that won&apos;t change — a fixed link, a Wi-Fi password, a contact card. A dynamic QR
            system (where the destination can be updated after printing) is on our roadmap, but
            isn&apos;t active yet — we won&apos;t label anything &ldquo;dynamic&rdquo; until it
            genuinely is.
          </p>
        </Container>
      </Section>
    </>
  );
}
