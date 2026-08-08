import Link from "next/link";
import { Container, Section } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Section className="flex min-h-[60vh] items-center">
      <Container className="flex flex-col items-center text-center">
        <p className="text-sm font-semibold text-primary">404</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-text sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-3 max-w-md text-base leading-relaxed text-text-muted">
          The page you&apos;re looking for doesn&apos;t exist or may have moved. Try the QR code
          generator, or head back home.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover"
          >
            Go home
          </Link>
          <Link
            href="/qr-code-generator"
            className="inline-flex h-11 items-center justify-center rounded-md border border-border px-6 text-sm font-medium text-text transition-colors hover:bg-surface"
          >
            Create a QR code
          </Link>
        </div>
      </Container>
    </Section>
  );
}
