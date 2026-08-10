import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client. Bypasses Row Level Security entirely —
 * server-only, never import this from a Client Component or anything
 * that reaches the browser bundle. Used only where there's no logged-in
 * user to scope a request to: the /r/[shortCode] redirect lookup, scan
 * logging, and the Safepay webhook.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
