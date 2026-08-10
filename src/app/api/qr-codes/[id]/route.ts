import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(request: Request, ctx: RouteContext<"/api/qr-codes/[id]">) {
  const { id } = await ctx.params;
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

  const updates: Record<string, unknown> = {};
  if (typeof body.name === "string") updates.name = body.name.slice(0, 200);
  if (typeof body.enabled === "boolean") updates.enabled = body.enabled;
  if (typeof body.destinationUrl === "string") updates.destination_url = body.destinationUrl;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const { data: row, error } = await supabase
    .from("qr_codes")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error || !row) {
    return NextResponse.json({ error: "QR code not found" }, { status: 404 });
  }

  return NextResponse.json({ qrCode: row });
}

export async function DELETE(_request: Request, ctx: RouteContext<"/api/qr-codes/[id]">) {
  const { id } = await ctx.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { error } = await supabase.from("qr_codes").delete().eq("id", id).eq("user_id", user.id);
  if (error) {
    return NextResponse.json({ error: "Could not delete QR code" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
