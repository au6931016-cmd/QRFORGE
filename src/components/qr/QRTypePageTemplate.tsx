import Link from "next/link";
import { AdSlot } from "@/components/ads/AdSlot";
import { QRCodeGenerator } from "@/components/qr/QRCodeGenerator";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { Container, Section } from "@/components/ui/Container";
import { qrTypeContent } from "@/data/qr-types/content";
import { qrTypeMeta } from "@/data/qr-types/meta";
import { faqJsonLd } from "@/lib/seo/json-ld";
import { cn } from "@/lib/utils/cn";
import type { QRCodeType } from "@/types/qr";

interface QRTypePageTemplateProps {
  type: QRCodeType;
}

const STEP_TONE_CLASSES = [
  "bg-primary/10 text-primary",
  "bg-accent-violet/10 text-accent-violet",
  "bg-accent-teal/10 text-accent-teal",
  "bg-accent-amber/10 text-accent-amber",
  "bg-accent-rose/10 text-accent-rose",
];

export function QRTypePageTemplate({ type }: QRTypePageTemplateProps) {
  const content = qrTypeContent[type];

  return (
    <>
      <JsonLd data={faqJsonLd(content.faq)} />
      <Section className="pb-0 pt-8 sm:pt-10">
        <Container>
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "QR Generator", path: "/qr-code-generator" },
              { name: content.h1, path: `/qr-code-generator/${type}` },
            ]}
          />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-text sm:text-4xl">
            {content.h1}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-text-muted">
            {content.intro}
          </p>
        </Container>
      </Section>

      <Section className="pt-8">
        <Container>
          <QRCodeGenerator lockedType={type} />
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <AdSlot placement="toolBottom" />
        </Container>
      </Section>

      <Section className="border-t border-border bg-surface/50">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold text-text">How it works</h2>
            <ol className="mt-4 space-y-3">
              {content.howItWorks.map((step, index) => (
                <li key={step} className="flex gap-3 text-sm leading-relaxed text-text-muted">
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                      STEP_TONE_CLASSES[index % STEP_TONE_CLASSES.length],
                    )}
                  >
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-text">Supported features</h2>
            <ul className="mt-4 space-y-3">
              {content.features.map((feature) => (
                <li key={feature} className="flex gap-3 text-sm leading-relaxed text-text-muted">
                  <span aria-hidden="true" className="mt-0.5 text-success">
                    ✓
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold text-text">Usage instructions</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-text-muted">
              {content.usage.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-text">Common mistakes to avoid</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-text-muted">
              {content.commonMistakes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section className="border-t border-border bg-surface/50">
        <Container className="max-w-3xl">
          <h2 className="text-xl font-semibold text-text">Frequently asked questions</h2>
          <div className="mt-6">
            <FaqAccordion items={content.faq} />
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 className="text-xl font-semibold text-text">Related QR code tools</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {content.relatedTypes.map((relatedType) => (
              <Link
                key={relatedType}
                href={`/qr-code-generator/${relatedType}`}
                className="rounded-full border border-border px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:border-primary hover:text-primary"
              >
                {qrTypeMeta[relatedType].label} QR Code
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
