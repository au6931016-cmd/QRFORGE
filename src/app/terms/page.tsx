import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Container, Section } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description: `The terms governing your use of ${siteConfig.name}.`,
  path: "/terms",
});

const lastUpdated = "January 1, 2026";

export default function TermsPage() {
  return (
    <Section className="pt-8 sm:pt-10">
      <Container className="max-w-3xl">
        <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Terms of Service", path: "/terms" }]} />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-text sm:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-text-muted">Last updated: {lastUpdated}</p>

        <div className="mt-8 space-y-8 text-base leading-relaxed text-text-muted">
          <section>
            <h2 className="text-xl font-semibold text-text">Using the service</h2>
            <p className="mt-3">
              {siteConfig.name} provides tools to generate, customize, download, and print QR
              codes. By using this site, you agree to use it lawfully and not to generate QR
              codes that link to illegal, fraudulent, or harmful content, including phishing
              pages, malware, or content that infringes on others&apos; rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text">Your content and responsibility</h2>
            <p className="mt-3">
              You are solely responsible for the data you encode into a QR code — including URLs,
              Wi-Fi credentials, and contact details — and for testing that the resulting code
              works as intended before distributing or printing it. We do not review or moderate
              QR code content generated through the static (client-side) generator, since that
              data is never sent to us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text">No guarantee of scan reliability</h2>
            <p className="mt-3">
              We do not guarantee that any QR code generated on this site will scan successfully
              on every device, camera, or scanning app, or under every printing condition. Scan
              reliability depends on factors outside our control, including contrast, size,
              print quality, and the scanning device itself. Always test a QR code before relying
              on it for critical use.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text">No guarantee of malicious URL detection</h2>
            <p className="mt-3">
              While we encourage responsible use, we cannot detect or block every malicious or
              unsafe URL entered into the generator. Exercise the same caution with QR codes that
              you would with any link.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text">Advertising</h2>
            <p className="mt-3">
              This site may display advertising, including through Google AdSense, in designated
              placements once approved. We do not guarantee AdSense approval, and advertising
              availability is subject to Google&apos;s review and current publisher policies. We
              do not guarantee any level of revenue or traffic from advertising or search engine
              rankings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text">Service availability</h2>
            <p className="mt-3">
              We aim to keep {siteConfig.name} available and functioning, but we don&apos;t
              guarantee uninterrupted access. Features may be added, changed, or removed over
              time as described in our public roadmap.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text">Changes to these terms</h2>
            <p className="mt-3">
              We may update these terms from time to time. Continued use of the site after an
              update constitutes acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text">Contact</h2>
            <p className="mt-3">
              Questions about these terms can be sent to{" "}
              <a href={`mailto:${siteConfig.legalEmail}`} className="font-medium text-primary hover:underline">
                {siteConfig.legalEmail}
              </a>
              .
            </p>
          </section>
        </div>
      </Container>
    </Section>
  );
}
