import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { DashboardQRTable } from "@/components/dashboard/DashboardQRTable";
import { createClient } from "@/lib/supabase/server";
import { buildMetadata } from "@/lib/seo/metadata";
import type { QRCodeRow } from "@/types/database";

export const metadata: Metadata = buildMetadata({
  title: "My QR Codes",
  description: "View, edit, and manage your saved QR codes.",
  path: "/dashboard",
  noIndex: true,
});

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard");

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan_tier")
    .eq("id", user.id)
    .single();

  const { data: qrCodes } = await supabase
    .from("qr_codes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const dynamicIds = (qrCodes ?? []).filter((qr) => qr.is_dynamic).map((qr) => qr.id);
  const scanCounts: Record<string, number> = {};
  if (dynamicIds.length > 0) {
    const { data: scans } = await supabase
      .from("qr_scans")
      .select("qr_code_id")
      .in("qr_code_id", dynamicIds);
    for (const scan of scans ?? []) {
      scanCounts[scan.qr_code_id] = (scanCounts[scan.qr_code_id] ?? 0) + 1;
    }
  }

  const totalQrCodes = qrCodes?.length ?? 0;
  const dynamicQrCount = (qrCodes ?? []).filter((qr) => qr.is_dynamic).length;
  const totalScans = Object.values(scanCounts).reduce((sum, count) => sum + count, 0);
  const planLabel = profile?.plan_tier === "pro" ? "Pro" : "Free";

  return (
    <div className="mx-auto max-w-6xl pb-12">
      <div className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-text-muted">Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold text-text">My QR workspace</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/account">
            <Button variant="outline" size="sm">
              Profile
            </Button>
          </Link>
          <Link href="/qr-code-generator">
            <Button size="sm">Create QR Code</Button>
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="pt-5">
            <p className="text-sm text-text-muted">Total QR codes</p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <p className="text-3xl font-semibold text-text">{totalQrCodes}</p>
              <Badge tone="primary">Saved</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <p className="text-sm text-text-muted">Dynamic QR</p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <p className="text-3xl font-semibold text-text">{dynamicQrCount}</p>
              <Badge tone="violet">Live</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <p className="text-sm text-text-muted">Total scans</p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <p className="text-3xl font-semibold text-text">{totalScans}</p>
              <Badge tone="teal">Engagement</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <p className="text-sm text-text-muted">Current plan</p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <p className="text-2xl font-semibold text-text">{planLabel}</p>
              <Badge tone={profile?.plan_tier === "pro" ? "violet" : "neutral"}>
                {profile?.plan_tier === "pro" ? "Active" : "Starter"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {qrCodes && qrCodes.length > 0 ? (
        <div className="mt-8">
          <DashboardQRTable
            qrCodes={qrCodes as QRCodeRow[]}
            scanCounts={scanCounts}
            userId={user.id}
          />
        </div>
      ) : (
        <Card className="mt-8">
          <CardContent className="px-6 py-10 text-center">
            <h2 className="text-xl font-semibold text-text">No saved QR codes yet</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-text-muted">
              Create your first QR code and save it to your account to start managing, tracking,
              and updating it from one place.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/qr-code-generator">
                <Button>Create QR Code</Button>
              </Link>
              <Link href="/account">
                <Button variant="outline">Open profile</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
