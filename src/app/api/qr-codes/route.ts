import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { validateQRData } from "@/lib/qr/schemas";
import { QR_CODE_TYPES } from "@/types/qr";
import type { QRCodeType } from "@/types/qr";

/**
 * Saves a QR code to the logged-in user's account. Re-validates form_data
 * server-side against the same Zod schemas the generator UI uses — the
 * client-side validation there is UX only, not a security boundary.
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { type, data, customization, name } = body as Record<string, unknown>;

  if (typeof type !== "string" || !QR_CODE_TYPES.includes(type as QRCodeType)) {
    return NextResponse.json({ error: "Invalid QR type" }, { status: 400 });
  }

  const result = validateQRData(type as QRCodeType, data);
  if (!result.success) {
    return NextResponse.json({ error: "Invalid QR data" }, { status: 400 });
  }

  if (!customization || typeof customization !== "object") {
    return NextResponse.json({ error: "Invalid customization" }, { status: 400 });
  }

  const { data: row, error } = await supabase
    .from("qr_codes")
    .insert({
      user_id: user.id,
      type,
      name: typeof name === "string" ? name.slice(0, 200) : "",
      form_data: result.data,
      customization,
      is_dynamic: false,
    })
    .select()
    .single();

  if (error || !row) {
    return NextResponse.json({ error: "Could not save QR code" }, { status: 500 });
  }

  return NextResponse.json({ qrCode: row }, { status: 201 });
}
