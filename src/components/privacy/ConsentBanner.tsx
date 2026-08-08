"use client";

import Link from "next/link";
import { useConsent } from "@/components/privacy/ConsentContext";
import { Button } from "@/components/ui/Button";

export function ConsentBanner() {
  const { decided, acceptAll, rejectAll } = useConsent();

  if (decided) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-bg/95 backdrop-blur supports-[backdrop-filter]:bg-bg/90"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-sm text-text-muted">
          We use optional cookies for analytics and advertising. Your QR code data always stays
          in your browser. Read our{" "}
          <Link href="/privacy" className="font-medium text-primary underline underline-offset-2">
            Privacy Policy
          </Link>{" "}
          to learn more.
        </p>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="sm" onClick={rejectAll}>
            Reject optional
          </Button>
          <Button size="sm" onClick={acceptAll}>
            Accept all
          </Button>
        </div>
      </div>
    </div>
  );
}
