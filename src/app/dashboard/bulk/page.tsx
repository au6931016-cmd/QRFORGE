import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BulkGenerator } from "@/components/dashboard/BulkGenerator";
import { createClient } from "@/lib/supabase/server";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Bulk Generate QR Codes",
  description: "Generate many QR codes at once from a CSV file.",
  path: "/dashboard/bulk",
  noIndex: true,
});

export default async function BulkGeneratePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard/bulk");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text">Bulk Generate QR Codes</h1>
      <p className="mt-2 text-sm text-text-muted">
        Upload a CSV of rows and download a ZIP of QR code images — all in your browser.
      </p>
      <div className="mt-6">
        <BulkGenerator />
      </div>
    </div>
  );
}
