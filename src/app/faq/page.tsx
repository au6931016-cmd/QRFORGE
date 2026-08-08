import type { Metadata } from "next";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container, Section } from "@/components/ui/Container";
import { globalFaq } from "@/data/faq";
import { faqJsonLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Frequently Asked Questions",
  description: "Answers to common questions about creating, customizing, and using QR codes on QRForge.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(globalFaq)} />
      <Section className="pt-8 sm:pt-10">
        <Container className="max-w-3xl">
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "FAQ", path: "/faq" }]} />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-text sm:text-4xl">
            Frequently asked questions
          </h1>
          <div className="mt-10">
            <FaqAccordion items={globalFaq} />
          </div>
        </Container>
      </Section>
    </>
  );
}
