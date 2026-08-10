/**
 * Whether Supabase credentials are set. Auth/Pro features stay inert
 * (rather than throwing) until this is true, matching how the ads,
 * analytics, and newsletter integrations already degrade gracefully when
 * unconfigured (see src/config/ads.ts, src/lib/analytics/index.ts).
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
