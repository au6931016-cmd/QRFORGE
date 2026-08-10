import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { QRDetailView } from "@/components/dashboard/QRDetailView";
import { createClient } from "@/lib/supabase/server";
import { buildMetadata } from "@/lib/seo/metadata";
import type { QRCodeRow } from "@/types/database";

export const metadata: Metadata = buildMetadata({
  title: "QR Code Details",
  description: "View and manage a saved QR code.",
  path: "/dashboard",
  noIndex: true,
});

export default async function QRDetailPage(props: PageProps<"/dashboard/[id]">) {
  const { id } = await props.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/dashboard/${id}`);

  const { data: qrCode } = await supabase.from("qr_codes").select("*").eq("id", id).single();
  if (!qrCode) notFound();

  return <QRDetailView qrCode={qrCode as QRCodeRow} />;
}
