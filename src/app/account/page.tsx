import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AccountView } from "@/components/dashboard/AccountView";
import { createClient } from "@/lib/supabase/server";
import { buildMetadata } from "@/lib/seo/metadata";
import type { Profile } from "@/types/database";

export const metadata: Metadata = buildMetadata({
  title: "Account",
  description: "Manage your account and plan.",
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

  return <AccountView profile={profile as Profile} />;
}
