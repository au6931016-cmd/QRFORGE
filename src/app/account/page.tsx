import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AccountView } from "@/components/dashboard/AccountView";
import { createClient } from "@/lib/supabase/server";
import { buildMetadata } from "@/lib/seo/metadata";
import type { Profile, QRCodeRow } from "@/types/database";

export const metadata: Metadata = buildMetadata({
  title: "Profile",
  description: "Manage your ScanGrid profile, QR activity, and account settings.",
  path: "/account",
  noIndex: true,
});

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  const [{ data: recentQrCodes }, { count: totalQrCodes }, { count: dynamicQrCount }, { count: favoriteCount }, { count: totalScans }] =
    await Promise.all([
      supabase
        .from("qr_codes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5),
      supabase.from("qr_codes").select("*", { count: "exact", head: true }).eq("user_id", user.id),
      supabase
        .from("qr_codes")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_dynamic", true),
      supabase
        .from("qr_codes")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_favorite", true),
      supabase.from("qr_scans").select("qr_code_id", { count: "exact", head: true }),
    ]);

  return (
    <AccountView
      profile={profile as Profile}
      qrCodeCount={totalQrCodes ?? 0}
      scanCount={totalScans ?? 0}
      recentQrCodes={(recentQrCodes ?? []) as QRCodeRow[]}
      dynamicQrCount={dynamicQrCount ?? 0}
      favoriteCount={favoriteCount ?? 0}
    />
  );
}
