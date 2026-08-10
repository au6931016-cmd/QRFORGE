import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { DashboardQRTable } from "@/components/dashboard/DashboardQRTable";
import { createClient } from "@/lib/supabase/server";
import { buildMetadata } from "@/lib/seo/metadata";
import type { QRCodeRow } from "@/types/database";

export const metadata: Metadata = buildMetadata({
  title: "My QR Codes",
  description: "View, edit, and manage your saved QR codes.",
  path: "/dashboard",
  noIndex: true,
});

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard");

  const { data: qrCodes } = await supabase
    .from("qr_codes")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-text">My QR Codes</h1>
        <Link href="/qr-code-generator">
          <Button size="sm">Create QR Code</Button>
        </Link>
      </div>

      {qrCodes && qrCodes.length > 0 ? (
        <div className="mt-6">
          <DashboardQRTable qrCodes={qrCodes as QRCodeRow[]} />
        </div>
      ) : (
        <p className="mt-6 text-sm text-text-muted">
          You haven&apos;t saved any QR codes yet. Create one and click &ldquo;Save to my
          account&rdquo; to see it here.
        </p>
      )}
    </div>
  );
}
