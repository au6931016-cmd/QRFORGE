import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { resolveShortCode } from "@/lib/dynamic-qr/lookup";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DynamicQRRedirectPage(props: PageProps<"/r/[shortCode]">) {
  const { shortCode } = await props.params;
  const destination = await resolveShortCode(shortCode);

  if (destination && destination.enabled) {
    redirect(destination.destinationUrl);
  }

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold text-text">Dynamic QR codes aren&apos;t live yet</h1>
      <p className="mt-3 text-sm leading-relaxed text-text-muted">
        This link is reserved for our upcoming dynamic QR code system, which isn&apos;t active
        yet. If you scanned a printed code expecting a specific destination, please contact
        whoever provided it.
      </p>
    </div>
  );
}
