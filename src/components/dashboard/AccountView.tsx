"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import {
  ClockHistoryIcon,
  QrCodeIcon,
  SettingsGearIcon,
  StarIcon,
} from "@/components/icons";
import { useAuth } from "@/components/auth/AuthContext";
import { getDisplayName } from "@/components/layout/UserMenu";
import type { Profile, QRCodeRow } from "@/types/database";

interface AccountViewProps {
  profile: Profile;
  qrCodeCount: number;
  scanCount: number;
  recentQrCodes: QRCodeRow[];
  dynamicQrCount: number;
  favoriteCount: number;
}

const quickLinks = [
  { label: "Saved QR Codes", href: "/dashboard", icon: QrCodeIcon },
  { label: "QR History", href: "/dashboard/history", icon: ClockHistoryIcon },
  { label: "Favorites", href: "/dashboard?filter=favorites", icon: StarIcon },
  { label: "Account settings", href: "/account/settings", icon: SettingsGearIcon },
];

export function AccountView({
  profile,
  qrCodeCount,
  scanCount,
  recentQrCodes,
  dynamicQrCount,
  favoriteCount,
}: AccountViewProps) {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const displayName = getDisplayName(user);

  const memberSince = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently";

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-6xl pb-12">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-text-muted">Profile</p>
          <h1 className="mt-2 text-3xl font-semibold text-text">Your ScanGrid account</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/account/settings">
            <Button variant="outline">Edit Profile</Button>
          </Link>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Manage QR Codes
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_2fr]">
        <Card>
          <CardContent className="space-y-5 pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent-violet text-xl font-semibold text-white">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text">{displayName}</h2>
                <p className="text-sm text-text-muted">{profile.email}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {profile.plan_tier === "pro" ? (
                <Badge tone="violet">Pro plan</Badge>
              ) : (
                <Badge>Free plan</Badge>
              )}
              <Badge tone="neutral">Member since {memberSince}</Badge>
            </div>

            <div className="space-y-3 text-sm text-text-muted">
              <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2">
                <span>Account status</span>
                <span className="font-medium text-success">Active</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2">
                <span>Login method</span>
                <span className="font-medium text-text">Email</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardContent className="pt-5">
              <p className="text-sm text-text-muted">QR codes created</p>
              <p className="mt-3 text-3xl font-semibold text-text">{qrCodeCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <p className="text-sm text-text-muted">Total scans</p>
              <p className="mt-3 text-3xl font-semibold text-text">{scanCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <p className="text-sm text-text-muted">Dynamic QR</p>
              <p className="mt-3 text-3xl font-semibold text-text">{dynamicQrCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <p className="text-sm text-text-muted">Favorites</p>
              <p className="mt-3 text-3xl font-semibold text-text">{favoriteCount}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text">Recent QR activity</h3>
              <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/history")}>
                View all
              </Button>
            </div>

            {recentQrCodes.length > 0 ? (
              <div className="space-y-3">
                {recentQrCodes.slice(0, 5).map((qr) => (
                  <div key={qr.id} className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-3">
                    <div>
                      <p className="font-medium text-text">{qr.name || "Untitled QR"}</p>
                      <p className="text-xs text-text-muted">
                        {qr.type.toUpperCase()} • {new Date(qr.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {qr.is_dynamic ? <Badge tone="violet">Dynamic</Badge> : <Badge>Static</Badge>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted">
                You have not created any QR codes yet. Start with the QR generator to create your first one.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold text-text">Quick links</h3>
            <div className="mt-4 space-y-2">
              {quickLinks.map(({ label, href, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex items-center gap-2.5 rounded-lg border border-border px-3 py-2.5 text-sm font-medium text-text transition-colors hover:bg-surface"
                >
                  <Icon className="h-4 w-4 text-text-muted" />
                  {label}
                </Link>
              ))}
              <Button variant="outline" className="w-full justify-start" onClick={handleSignOut}>
                Sign out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
