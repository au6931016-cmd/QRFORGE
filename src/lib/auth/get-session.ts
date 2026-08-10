import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Profile } from "@/types/database";

/** Server-side session + profile lookup, for Server Components. */
export async function getSession() {
  if (!isSupabaseConfigured()) return { user: null, profile: null };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, profile: null };

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  return { user, profile: (profile as Profile) ?? null };
}
