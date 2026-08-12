import type { Profile } from "@/types/database";

export function isProfilePro(profile: Pick<Profile, "plan_tier" | "plan_expires_at"> | null): boolean {
  if (!profile || profile.plan_tier !== "pro") return false;

  if (!profile.plan_expires_at) return true;

  return new Date(profile.plan_expires_at).getTime() > Date.now();
}
