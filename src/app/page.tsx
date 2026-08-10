import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/blog/ArticleCard";
import {
  BoltIcon,
  BuildingIcon,
  CalendarIcon,
  MegaphoneIcon,
  PaletteIcon,
  PrinterIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  UsersIcon,
  UtensilsIcon,
} from "@/components/icons";
import { NewsletterForm } from "@/components/marketing/NewsletterForm";
import { QRCodeGenerator } from "@/components/qr/QRCodeGenerator";
import { Badge } from "@/components/ui/Badge";
import { Container, Section } from "@/components/ui/Container";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { JsonLd } from "@/components/seo/JsonLd";
import { getRecentPosts } from "@/data/blog/posts";
import { globalFaq } from "@/data/faq";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo/metadata";
import { faqJsonLd, softwareApplicationJsonLd } from "@/lib/seo/json-ld";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = buildMetadata({
  title: siteConfig.seo.defaultTitle,
  description: siteConfig.seo.defaultDescription,
  path: "/",
});

type Tone = "primary" | "violet" | "teal" | "rose" | "amber" | "accent";

const TONE_CLASSES: Record<Tone, string> = {
  primary: "bg-primary/10 text-primary",
  violet: "bg-accent-violet/10 text-accent-violet",
  teal: "bg-accent-teal/10 text-accent-teal",
  rose: "bg-accent-rose/10 text-accent-rose",
  amber: "bg-accent-amber/10 text-accent-amber",
  accent: "bg-accent/10 text-accent",
};

const benefits = [
  {
    title: "No signup required",
    description: "Start generating QR codes immediately — no account, no email gate.",
    icon: BoltIcon,
    tone: "amber" as Tone,
  },
  {
    title: "Your data stays private",
    description: "QR codes are built entirely in your browser and never uploaded to a server.",
    icon: ShieldCheckIcon,
    tone: "teal" as Tone,
  },
  {
    title: "Genuinely customizable",
    description: "Colors, shapes, logos, and frames — without breaking scan reliability.",
    icon: PaletteIcon,
    tone: "violet" as Tone,
  },
  {
    title: "Print-ready output",
    description: "Download crisp PNG or SVG files, or print directly from a clean layout.",
    icon: PrinterIcon,
    tone: "primary" as Tone,
  },
];

const useCases = [
  {
    title: "Restaurants & cafes",
    description: "Digital menus, Wi-Fi access, and feedback links for tables.",
    icon: UtensilsIcon,
    tone: "amber" as Tone,
  },
  {
    title: "Retail & packaging",
    description: "Product info, manuals, and warranty registration on the go.",
    icon: ShoppingBagIcon,
    tone: "rose" as Tone,
  },
  {
    title: "Events & venues",
    description: "Calendar adds, directions, and check-in flows for attendees.",
    icon: CalendarIcon,
    tone: "violet" as Tone,
  },
  {
    title: "Real estate",
    description: "Listing pages and virtual tours linked from yard signs and flyers.",
    icon: BuildingIcon,
    tone: "primary" as Tone,
  },
  {
    title: "Professional networking",
    description: "Digital business cards that save straight to contacts.",
    icon: UsersIcon,
    tone: "teal" as Tone,
  },
  {
    title: "Marketing campaigns",
    description: "Print-to-digital bridges for ads, packaging, and direct mail.",
    icon: MegaphoneIcon,
    tone: "accent" as Tone,
  },
];

const roadmapFeatures = [
  { title: "Dynamic QR codes", description: "Edit a code's destination after it's printed." },
  { title: "Saved QR codes", description: "Manage all your codes from one account." },
  { title: "Scan analytics", description: "See when and how often your codes are scanned." },
  { title: "Bulk generation", description: "Create hundreds of codes at once from a spreadsheet." },
];

export default function HomePage() {
  const recentPosts = getRecentPosts(3);

  return (
    <>
      <JsonLd data={softwareApplicationJsonLd()} />
      <JsonLd data={faqJsonLd(globalFaq.slice(0, 5))} />
      <Section className="hero-mesh pb-0 pt-10 sm:pt-14">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-text sm:text-5xl">
              Free <span className="text-gradient-brand">QR Code</span> Generator
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-text-muted">
              Create, customize, download, and print QR codes in seconds.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="#generator"
                className="inline-flex h-11 items-center justify-center rounded-md bg-gradient-to-r from-primary to-accent-violet px-6 text-sm font-medium text-primary-foreground shadow-sm shadow-primary/25 transition-all hover:shadow-md hover:shadow-primary/30 hover:brightness-110"
              >
                Create QR Code
              </Link>
              <Link
                href="/qr-tools"
                className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-bg px-6 text-sm font-medium text-text transition-colors hover:bg-surface"
              >
                Explore QR Tools
              </Link>
            </div>
          </div>

          <div id="generator" className="mt-12 scroll-mt-24">
            <QRCodeGenerator />
          </div>
        </Container>
      </Section>

      <Section className="border-t border-border bg-surface/50">
        <Container>
          <h2 className="text-center text-2xl font-semibold text-text">Why {siteConfig.name}</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-lg border border-border bg-bg p-5 transition-shadow hover:shadow-md"
              >
                <div
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-lg",
                    TONE_CLASSES[benefit.tone],
                  )}
                >
                  <benefit.icon />
                </div>
                <h3 className="mt-4 font-semibold text-text">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{benefit.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 className="text-2xl font-semibold text-text">Built for real business use cases</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {useCases.map((useCase) => (
              <div
                key={useCase.title}
                className="rounded-lg border border-border bg-bg p-5 transition-shadow hover:shadow-md"
              >
                <div
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-lg",
                    TONE_CLASSES[useCase.tone],
                  )}
                >
                  <useCase.icon />
                </div>
                <h3 className="mt-4 font-semibold text-text">{useCase.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{useCase.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/qr-tools" className="text-sm font-medium text-primary hover:underline">
              Browse ready-made templates →
            </Link>
          </div>
        </Container>
      </Section>

      <Section className="border-t border-border bg-surface/50">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Badge tone="violet">Coming soon</Badge>
              <h2 className="mt-3 text-2xl font-semibold text-text">What&apos;s next for {siteConfig.name}</h2>
              <p className="mt-2 max-w-xl text-sm text-text-muted">
                Today&apos;s generator is free and fully static. Here&apos;s what we&apos;re building
                next — none of it is live yet, and we&apos;ll only call a feature &ldquo;dynamic&rdquo;
                once it truly is.
              </p>
            </div>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {roadmapFeatures.map((feature) => (
              <div key={feature.title} className="rounded-lg border border-dashed border-border bg-bg p-5">
                <h3 className="font-semibold text-text">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{feature.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="max-w-3xl">
          <h2 className="text-2xl font-semibold text-text">Frequently asked questions</h2>
          <div className="mt-8">
            <FaqAccordion items={globalFaq.slice(0, 5)} />
          </div>
          <div className="mt-6 text-center">
            <Link href="/faq" className="text-sm font-medium text-primary hover:underline">
              View all FAQs →
            </Link>
          </div>
        </Container>
      </Section>

      <Section className="border-t border-border bg-surface/50">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold text-text">From the blog</h2>
            <Link href="/blog" className="text-sm font-medium text-primary hover:underline">
              View all articles →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        </Container>
      </Section>

      <Section className="border-t border-border">
        <Container className="flex flex-col items-center text-center">
          <h2 className="text-2xl font-semibold text-text">Stay in the loop</h2>
          <p className="mt-2 max-w-md text-sm text-text-muted">
            Occasional tips on QR codes and new features. No spam.
          </p>
          <div className="mt-6">
            <NewsletterForm />
          </div>
        </Container>
      </Section>
    </>
  );
}
