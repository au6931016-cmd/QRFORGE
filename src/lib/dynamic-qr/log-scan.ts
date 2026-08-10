import { createAdminClient } from "@/lib/supabase/admin";

/** Records a scan event. Called via after() so it never delays the redirect. */
export async function logScan(qrCodeId: string, referrer: string | null, userAgent: string | null) {
  const supabase = createAdminClient();
  await supabase.from("qr_scans").insert({
    qr_code_id: qrCodeId,
    referrer,
    user_agent: userAgent,
  });
}
