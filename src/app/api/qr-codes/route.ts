import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildQRPayload } from "@/lib/qr/encode";
import { validateQRData } from "@/lib/qr/schemas";
import { QR_CODE_TYPES } from "@/types/qr";
import type { QRCodeType } from "@/types/qr";
import type { Profile } from "@/types/database";

const MAX_SHORT_CODE_ATTEMPTS = 5;

/**
 * Saves a QR code to the logged-in user's account. Re-validates form_data
 * server-side against the same Zod schemas the generator UI uses — the
 * client-side validation there is UX only, not a security boundary.
 *
 * Dynamic QR codes (isDynamic: true) are Pro-only and limited to the
 * "url" type for v1 — a redirect target only makes sense for link-like
 * payloads. Plan tier is re-checked here since the client-side gate is
 * UX only, same as the schema re-validation above.
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

  const { type, data, customization, name, isDynamic } = body as Record<string, unknown>;

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

  const wantsDynamic = isDynamic === true;

  if (wantsDynamic && type !== "url") {
    return NextResponse.json({ error: "Only URL QR codes can be made dynamic" }, { status: 400 });
  }

  if (wantsDynamic) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan_tier, plan_expires_at")
      .eq("id", user.id)
      .single<Pick<Profile, "plan_tier" | "plan_expires_at">>();

    const isPro =
      profile?.plan_tier === "pro" &&
      (!profile.plan_expires_at || new Date(profile.plan_expires_at).getTime() > Date.now());

    if (!isPro) {
      return NextResponse.json({ error: "Dynamic QR codes require a Pro plan" }, { status: 403 });
    }
  }

  const insertPayload: Record<string, unknown> = {
    user_id: user.id,
    type,
    name: typeof name === "string" ? name.slice(0, 200) : "",
    form_data: result.data,
    customization,
    is_dynamic: wantsDynamic,
  };

  if (wantsDynamic) {
    insertPayload.destination_url = buildQRPayload("url", result.data as never);

    for (let attempt = 0; attempt < MAX_SHORT_CODE_ATTEMPTS; attempt++) {
      const { data: row, error } = await supabase
        .from("qr_codes")
        .insert({ ...insertPayload, short_code: nanoid(8) })
        .select()
        .single();

      if (!error) {
        return NextResponse.json({ qrCode: row }, { status: 201 });
      }
      // Postgres unique_violation — retry with a new short code.
      if (error.code !== "23505") {
        return NextResponse.json({ error: "Could not save QR code" }, { status: 500 });
      }
    }

    return NextResponse.json({ error: "Could not generate a unique short code" }, { status: 500 });
  }

  const { data: row, error } = await supabase
    .from("qr_codes")
    .insert(insertPayload)
    .select()
    .single();

  if (error || !row) {
    return NextResponse.json({ error: "Could not save QR code" }, { status: 500 });
  }

  return NextResponse.json({ qrCode: row }, { status: 201 });
}
