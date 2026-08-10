import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Resolves a dynamic QR code's short code to its current destination.
 * Runs with the service-role client since scanners have no logged-in
 * session — RLS on qr_codes has no policy for anonymous reads by design.
 */
export interface DynamicDestination {
  id: string;
  shortCode: string;
  destinationUrl: string;
  enabled: boolean;
}

export async function resolveShortCode(shortCode: string): Promise<DynamicDestination | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("qr_codes")
    .select("id, short_code, destination_url, enabled")
    .eq("short_code", shortCode)
    .eq("is_dynamic", true)
    .maybeSingle();

  if (!data || !data.destination_url) return null;

  return {
    id: data.id,
    shortCode: data.short_code,
    destinationUrl: data.destination_url,
    enabled: data.enabled,
  };
}
