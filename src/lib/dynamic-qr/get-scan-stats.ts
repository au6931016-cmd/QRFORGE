import type { SupabaseClient } from "@supabase/supabase-js";

export interface ScanStats {
  totalScans: number;
  last7Days: number;
  lastScanAt: string | null;
  dailyCounts: [string, number][];
}

export async function getScanStats(
  supabase: SupabaseClient,
  qrCodeId: string,
): Promise<ScanStats> {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [{ count: totalScans }, { count: last7Days }, { data: lastScanRows }, { data: recentScans }] =
    await Promise.all([
      supabase.from("qr_scans").select("*", { count: "exact", head: true }).eq("qr_code_id", qrCodeId),
      supabase
        .from("qr_scans")
        .select("*", { count: "exact", head: true })
        .eq("qr_code_id", qrCodeId)
        .gte("scanned_at", sevenDaysAgo),
      supabase
        .from("qr_scans")
        .select("scanned_at")
        .eq("qr_code_id", qrCodeId)
        .order("scanned_at", { ascending: false })
        .limit(1),
      supabase
        .from("qr_scans")
        .select("scanned_at")
        .eq("qr_code_id", qrCodeId)
        .gte("scanned_at", thirtyDaysAgo)
        .order("scanned_at", { ascending: false }),
    ]);

  const dailyCounts = new Map<string, number>();
  for (const scan of recentScans ?? []) {
    const day = new Date(scan.scanned_at).toLocaleDateString();
    dailyCounts.set(day, (dailyCounts.get(day) ?? 0) + 1);
  }

  return {
    totalScans: totalScans ?? 0,
    last7Days: last7Days ?? 0,
    lastScanAt: lastScanRows?.[0]?.scanned_at ?? null,
    dailyCounts: Array.from(dailyCounts.entries()),
  };
}
