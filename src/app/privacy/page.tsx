import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Container, Section } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: `How ${siteConfig.name} handles data, cookies, analytics, and advertising.`,
  path: "/privacy",
});

const lastUpdated = "January 1, 2026";

export default function PrivacyPage() {
  return (
    <Section className="pt-8 sm:pt-10">
      <Container className="max-w-3xl">
        <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Privacy Policy", path: "/privacy" }]} />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-text sm:text-4xl">Privacy Policy</h1>
        <p className="mt-2 text-sm text-text-muted">Last updated: {lastUpdated}</p>

        <div className="mt-8 space-y-8 text-base leading-relaxed text-text-muted">
          <section>
            <h2 className="text-xl font-semibold text-text">QR code data</h2>
            <p className="mt-3">
              The static QR code generator on {siteConfig.name} runs entirely in your browser.
              The URLs, Wi-Fi credentials, contact details, event information, or any other text
              you enter to build a QR code are processed locally on your device and are{" "}
              <strong>not transmitted to or stored on our servers</strong>. If we ever introduce
              a feature that requires server-side storage (such as dynamic QR codes with editable
              destinations, described below), that feature will be clearly labeled and will only
              store the minimum data necessary to operate it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text">Dynamic QR data (future feature)</h2>
            <p className="mt-3">
              We are developing a dynamic QR code system where a printed code&apos;s destination
              can be updated later. This feature is not active today. Once launched, it will
              necessarily store the destination URL and basic configuration associated with each
              dynamic code on our servers, since that is how the redirect works. We will update
              this policy with full details before that feature goes live.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text">Cookies &amp; consent</h2>
            <p className="mt-3">
              We use a consent banner to ask for permission before enabling optional analytics
              or advertising cookies. Strictly necessary cookies (for example, remembering your
              consent choice) may be used regardless, since the site cannot function correctly
              without them. You can change your choice at any time by clearing your browser&apos;s
              local storage for this site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text">Analytics</h2>
            <p className="mt-3">
              If analytics is enabled, we use it in aggregate form to understand which pages and
              QR code types are most useful, so we can improve the site. Analytics only loads
              after you consent to it, and never has access to the content of the QR codes you
              generate.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text">Advertising</h2>
            <p className="mt-3">
              We may show advertising (for example, via Google AdSense) in designated placements
              that are visually separate from the QR code generator itself. Advertising only
              loads after you consent to it. Ads will never be placed over form fields, buttons,
              or the QR code preview.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text">User accounts (future feature)</h2>
            <p className="mt-3">
              User accounts are not available today. If we introduce them in the future — to
              support saved QR codes or subscriptions — we will collect only the information
              necessary to operate that account (such as an email address) and will update this
              policy accordingly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text">Data retention</h2>
            <p className="mt-3">
              Because the core generator doesn&apos;t transmit your QR code data to us, there is
              nothing for us to retain from that process. Consent preferences are stored locally
              in your browser until you clear them. Any data collected through future account or
              dynamic QR features will be retained only as long as necessary to provide that
              feature, and deleted upon account closure or your request.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text">Contact</h2>
            <p className="mt-3">
              Questions about this policy can be sent to{" "}
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
