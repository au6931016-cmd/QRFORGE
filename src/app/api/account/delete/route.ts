import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

/**
 * Permanently deletes the signed-in user's auth record. `profiles` and
 * `qr_codes` cascade-delete via their `on delete cascade` foreign keys in
 * supabase/schema.sql — no separate cleanup needed here.
 */
export async function DELETE() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    return NextResponse.json({ error: "Could not delete account" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
