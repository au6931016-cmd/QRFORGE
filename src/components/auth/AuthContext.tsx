"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isProfilePro } from "@/lib/auth/pro-plan";
import type { Profile } from "@/types/database";

interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isPro: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function computeIsPro(profile: Profile | null): boolean {
  return isProfilePro(profile);
}

interface AuthProviderProps {
  children: React.ReactNode;
  /** Seeded from a server-fetched session in src/app/layout.tsx, so the
   * first client render already knows the logged-in state instead of
   * flashing "logged out" while the browser client initializes. */
  initialUser: User | null;
  initialProfile: Profile | null;
}

export function AuthProvider({ children, initialUser, initialProfile }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [profile, setProfile] = useState<Profile | null>(initialProfile);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const supabase = createClient();

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);

      if (!nextUser) {
        setProfile(null);
        return;
      }

      setIsLoading(true);
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", nextUser.id)
        .single();
      setProfile((data as Profile) ?? null);
      setIsLoading(false);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }

  const value = useMemo(
    () => ({ user, profile, isLoading, isPro: computeIsPro(profile), signOut }),
    [user, profile, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
