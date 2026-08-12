import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AccountSettingsView } from "@/components/dashboard/AccountSettingsView";
import { createClient } from "@/lib/supabase/server";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Settings",
  description: "Manage your profile, security, and account settings.",
  path: "/account/settings",
  noIndex: true,
});

export default async function AccountSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account/settings");

  const fullName = typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : "";

  return <AccountSettingsView email={user.email ?? ""} fullName={fullName} />;
}
