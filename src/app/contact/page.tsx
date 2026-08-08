import type { Metadata } from "next";
import { ContactForm } from "@/components/marketing/ContactForm";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Container, Section } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: `Get in touch with the ${siteConfig.name} team.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <Section className="pt-8 sm:pt-10">
      <Container className="max-w-3xl">
        <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]} />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-text sm:text-4xl">Contact us</h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-text-muted">
          Questions, feedback, or found a bug? Email us directly at{" "}
          <a href={`mailto:${siteConfig.contactEmail}`} className="font-medium text-primary hover:underline">
            {siteConfig.contactEmail}
          </a>{" "}
          or use the form below.
        </p>
        <div className="mt-10">
          <ContactForm />
        </div>
      </Container>
    </Section>
  );
}
