import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Container, Section } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Acceptable Use Policy",
  description: `Rules for acceptable use of ${siteConfig.name}'s QR code generation tools.`,
  path: "/acceptable-use",
});

export default function AcceptableUsePage() {
  return (
    <Section className="pt-8 sm:pt-10">
      <Container className="max-w-3xl">
        <Breadcrumbs
          items={[{ name: "Home", path: "/" }, { name: "Acceptable Use", path: "/acceptable-use" }]}
        />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-text sm:text-4xl">
          Acceptable Use Policy
        </h1>

        <div className="mt-8 space-y-6 text-base leading-relaxed text-text-muted">
          <p>
            {siteConfig.name} is provided for legitimate personal and business use. To keep the
            service usable and trustworthy for everyone, you agree not to use it to:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Generate QR codes linking to phishing pages, malware, or other deceptive content.</li>
            <li>Generate QR codes intended to defraud, scam, or mislead scanners about their destination.</li>
            <li>Distribute QR codes that infringe on someone else&apos;s intellectual property rights.</li>
            <li>Attempt to disrupt, overload, or reverse-engineer the site&apos;s infrastructure.</li>
            <li>Use automated tools to scrape or abuse the service at a scale that degrades it for others.</li>
            <li>Use the service to violate any applicable law or regulation.</li>
          </ul>
          <p>
            Because static QR codes are generated client-side and never sent to our servers, we
            have no visibility into codes created through the core generator and cannot actively
            monitor them. We&apos;re building abuse-reporting and moderation tooling for the
            future dynamic QR system, where destinations are server-hosted and can be reviewed
            and disabled if reported.
          </p>
          <h2 className="pt-2 text-xl font-semibold text-text">Report abuse</h2>
          <p>
            If you encounter a QR code created using our tools that violates this policy, or a
            printed/dynamic code that appears fraudulent, please report it to{" "}
            <a href={`mailto:${siteConfig.legalEmail}`} className="font-medium text-primary hover:underline">
              {siteConfig.legalEmail}
            </a>
            . Include as much detail as possible, such as where you encountered the code and, if
            known, its destination.
          </p>
        </div>
      </Container>
    </Section>
  );
}
