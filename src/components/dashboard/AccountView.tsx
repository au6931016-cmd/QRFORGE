"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useAuth } from "@/components/auth/AuthContext";
import type { Profile } from "@/types/database";

interface AccountViewProps {
  profile: Profile;
}

export function AccountView({ profile }: AccountViewProps) {
  const router = useRouter();
  const { signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold text-text">Account</h1>

      <Card className="mt-6">
        <CardContent className="space-y-4 pt-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">Email</p>
            <p className="mt-1 text-sm text-text">{profile.email}</p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">Plan</p>
            <div className="mt-1.5">
              {profile.plan_tier === "pro" ? (
                <Badge tone="violet">Pro</Badge>
              ) : (
                <Badge>Free</Badge>
              )}
            </div>
            {profile.plan_tier === "free" && (
              <p className="mt-2 text-sm text-text-muted">
                Pro plans (dynamic QR codes, scan analytics, bulk generation, no ads) are coming
                soon.
              </p>
            )}
            {profile.plan_tier === "pro" && profile.plan_expires_at && (
              <p className="mt-2 text-sm text-text-muted">
                Renews on {new Date(profile.plan_expires_at).toLocaleDateString()}
              </p>
            )}
          </div>

          <Button variant="outline" onClick={handleSignOut}>
            Sign out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
