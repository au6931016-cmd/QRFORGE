import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Container, Section } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description: `Learn what ${siteConfig.name} is, how it works, and the principles behind it.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <Section className="pt-8 sm:pt-10">
      <Container className="max-w-3xl">
        <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "About", path: "/about" }]} />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-text sm:text-4xl">
          About {siteConfig.name}
        </h1>

        <div className="mt-8 space-y-6 text-base leading-relaxed text-text-muted">
          <p>
            {siteConfig.name} is a free QR code generator built around one idea: creating a QR
            code shouldn&apos;t require an account, a subscription, or handing your data to a
            server you can&apos;t see. Every code on this site is generated directly in your
            browser.
          </p>
          <p>
            We built this generator to cover the QR code types people actually need day to day —
            website links, Wi-Fi access, digital business cards, calendar events, and more — with
            real customization (colors, shapes, logos) that doesn&apos;t compromise how reliably
            the code scans.
          </p>
          <h2 className="pt-2 text-xl font-semibold text-text">What we believe</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>QR code generation for common use cases should be free and unlimited.</li>
            <li>Your data belongs in your browser, not on our servers, whenever that&apos;s possible.</li>
            <li>A tool should tell you honestly what it can and can&apos;t do — we won&apos;t claim a QR code is &ldquo;dynamic&rdquo; when it isn&apos;t, or promise 100% scan reliability.</li>
            <li>Advertising, if and when it&apos;s enabled, should never interfere with the tool itself.</li>
          </ul>
          <h2 className="pt-2 text-xl font-semibold text-text">What&apos;s next</h2>
          <p>
            We&apos;re building toward dynamic QR codes, accounts, and analytics as optional
            future features — see our{" "}
            <a href="/qr-code-generator" className="font-medium text-primary hover:underline">
              QR code generator
            </a>{" "}
            for what&apos;s available today. Nothing about the free, static generator will
            require an account to keep using.
          </p>
          <h2 className="pt-2 text-xl font-semibold text-text">Get in touch</h2>
          <p>
            Questions, feedback, or a bug to report? Visit our{" "}
            <a href="/contact" className="font-medium text-primary hover:underline">
              contact page
            </a>
            .
          </p>
        </div>
      </Container>
    </Section>
  );
}
