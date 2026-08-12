import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { QRHistoryList } from "@/components/dashboard/QRHistoryList";
import { createClient } from "@/lib/supabase/server";
import { buildMetadata } from "@/lib/seo/metadata";
import type { QRCodeRow } from "@/types/database";

export const metadata: Metadata = buildMetadata({
  title: "QR History",
  description: "Every QR code you've generated and saved to your account.",
  path: "/dashboard/history",
  noIndex: true,
});

export default async function QRHistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard/history");

  const { data: qrCodes } = await supabase
    .from("qr_codes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text">QR History</h1>
      <p className="mt-2 text-sm text-text-muted">
        A chronological record of every QR code you&apos;ve generated and saved.
      </p>
      <div className="mt-6">
        <QRHistoryList qrCodes={(qrCodes ?? []) as QRCodeRow[]} />
      </div>
    </div>
  );
}
