"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Container";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to the console for local debugging; never surface stack traces
    // to the user — see the human-readable message below.
    console.error(error);
  }, [error]);

  return (
    <Section className="flex min-h-[60vh] items-center">
      <Container className="flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
          Something went wrong
        </h1>
        <p className="mt-3 max-w-md text-base leading-relaxed text-text-muted">
          We hit an unexpected error loading this page. You can try again, or head back to the
          homepage.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={reset}>Try again</Button>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-md border border-border px-6 text-sm font-medium text-text transition-colors hover:bg-surface"
          >
            Go home
          </Link>
        </div>
      </Container>
    </Section>
  );
}
