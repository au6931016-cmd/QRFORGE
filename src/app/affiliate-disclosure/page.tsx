import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Container, Section } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Affiliate Disclosure",
  description: `How ${siteConfig.name} discloses affiliate relationships and sponsored content.`,
  path: "/affiliate-disclosure",
});

export default function AffiliateDisclosurePage() {
  return (
    <Section className="pt-8 sm:pt-10">
      <Container className="max-w-3xl">
        <Breadcrumbs
          items={[{ name: "Home", path: "/" }, { name: "Affiliate Disclosure", path: "/affiliate-disclosure" }]}
        />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-text sm:text-4xl">
          Affiliate Disclosure
        </h1>

        <div className="mt-8 space-y-6 text-base leading-relaxed text-text-muted">
          <p>
            {siteConfig.name} does not currently participate in any affiliate marketing programs.
            This page exists so that if we do add affiliate links or sponsored content in the
            future — for example, linking to third-party QR code scanning apps, printing
            services, or related products — we have a clear, easy-to-find place to disclose it,
            as required by the FTC and similar guidelines in other jurisdictions.
          </p>
          <p>
            If we add affiliate relationships, this page will be updated to state clearly which
            links are affiliate links, and any article or page containing them will include an
            inline disclosure near the link itself. We only recommend products or services we
            believe are genuinely useful, and an affiliate relationship never determines the
            recommendations we make.
          </p>
          <h2 className="pt-2 text-xl font-semibold text-text">Advertising is separate</h2>
          <p>
            Display advertising (such as Google AdSense, if enabled) is a separate mechanism from
            affiliate marketing and is disclosed in our{" "}
            <a href="/privacy" className="font-medium text-primary hover:underline">
              Privacy Policy
            </a>
            .
          </p>
          <h2 className="pt-2 text-xl font-semibold text-text">Contact</h2>
          <p>
            Questions about this disclosure can be sent to{" "}
            <a href={`mailto:${siteConfig.legalEmail}`} className="font-medium text-primary hover:underline">
              {siteConfig.legalEmail}
            </a>
            .
          </p>
        </div>
      </Container>
    </Section>
  );
}
