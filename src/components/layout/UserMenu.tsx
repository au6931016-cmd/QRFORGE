"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactElement } from "react";
import type { User } from "@supabase/supabase-js";
import { Badge } from "@/components/ui/Badge";
import {
  ClockHistoryIcon,
  HelpCircleIcon,
  LogOutIcon,
  MailIcon,
  QrCodeIcon,
  SettingsGearIcon,
  SparklesIcon,
  StarIcon,
  LayoutGridIcon,
  UserCircleIcon,
} from "@/components/icons";
import { useAuth } from "@/components/auth/AuthContext";
import { cn } from "@/lib/utils/cn";

export function getDisplayName(user: User | null): string {
  const metaName = user?.user_metadata?.full_name;
  if (typeof metaName === "string" && metaName.trim()) return metaName.trim();
  return user?.email ? user.email.split("@")[0] : "Account";
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

interface MenuLink {
  label: string;
  href: string;
  icon: (props: { className?: string }) => ReactElement;
  meta?: string;
}

const accountLinks: MenuLink[] = [
  { label: "Profile / Account", href: "/account", icon: UserCircleIcon },
  { label: "Saved QR Codes", href: "/dashboard", icon: QrCodeIcon },
  { label: "QR History", href: "/dashboard/history", icon: ClockHistoryIcon },
  { label: "Favorites", href: "/dashboard?filter=favorites", icon: StarIcon },
  { label: "Templates", href: "/qr-tools", icon: LayoutGridIcon },
  { label: "Settings", href: "/account/settings", icon: SettingsGearIcon },
];

const supportLinks: MenuLink[] = [
  { label: "Help / FAQ", href: "/faq", icon: HelpCircleIcon },
  { label: "Contact Support", href: "/contact", icon: MailIcon },
];

function Avatar({ name, size = "sm" }: { name: string; size?: "sm" | "lg" }) {
  return (
    <span
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent-violet font-semibold text-white shadow-sm",
        size === "sm" ? "h-8 w-8 text-xs" : "h-12 w-12 text-base",
      )}
    >
      {getInitials(name)}
      <span
        aria-hidden="true"
        className={cn(
          "absolute rounded-full border-2 border-bg bg-success",
          size === "sm" ? "-bottom-0.5 -right-0.5 h-2.5 w-2.5" : "-bottom-0.5 -right-0.5 h-3 w-3",
        )}
      />
    </span>
  );
}

export function UserMenu() {
  const router = useRouter();
  const { user, profile, isPro, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const displayName = getDisplayName(user);

  useEffect(() => {
    if (!open) return;
    const firstItem = menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]');
    firstItem?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handlePointer(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      const items = menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]');
      if (!items || items.length === 0) return;
      event.preventDefault();
      const currentIndex = Array.from(items).findIndex((item) => item === document.activeElement);
      const nextIndex =
        event.key === "ArrowDown"
          ? (currentIndex + 1) % items.length
          : (currentIndex - 1 + items.length) % items.length;
      items[nextIndex]?.focus();
    }

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  async function handleSignOut() {
    setOpen(false);
    await signOut();
    router.push("/");
    router.refresh();
  }

  if (!user) return null;

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account menu for ${displayName}`}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/90 py-1.5 pl-1.5 pr-2.5 text-sm font-medium text-text shadow-sm transition-all hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <Avatar name={displayName} />
        <span className="hidden max-w-[9rem] truncate lg:inline">{displayName}</span>
        <svg
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          className={cn("h-4 w-4 text-text-muted transition-transform", open && "rotate-180")}
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          aria-label="Account"
          className="menu-pop absolute right-0 z-50 mt-2 max-h-[calc(100vh-5rem)] w-72 origin-top-right overflow-y-auto rounded-xl border border-border bg-bg p-1.5 shadow-xl shadow-black/10"
        >
          <div className="flex items-center gap-3 px-3 py-3">
            <Avatar name={displayName} size="lg" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text">{displayName}</p>
              <p className="truncate text-xs text-text-muted">{user.email}</p>
              <Badge tone={isPro ? "violet" : "neutral"} className="mt-1.5">
                {isPro ? "Pro Plan" : "Free Plan"}
              </Badge>
            </div>
          </div>

          <div className="my-1 border-t border-border" />

          <div className="py-1">
            {accountLinks.map(({ label, href, icon: Icon, meta }) => (
              <Link
                key={label}
                role="menuitem"
                tabIndex={-1}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-text outline-none transition-colors hover:bg-surface focus-visible:bg-surface"
              >
                <Icon className="h-4 w-4 text-text-muted" />
                <span className="flex-1">{label}</span>
                {meta && <span className="text-xs text-text-muted">{meta}</span>}
              </Link>
            ))}
          </div>

          <div className="my-1 border-t border-border" />

          <div className="rounded-lg bg-surface px-3 py-2.5">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                  Current plan
                </p>
                <p className="text-sm font-semibold text-text">
                  {isPro ? "Pro" : "Free"}
                  {profile?.plan_tier === "pro" && profile.plan_expires_at && (
                    <span className="ml-1 font-normal text-text-muted">
                      · renews {new Date(profile.plan_expires_at).toLocaleDateString()}
                    </span>
                  )}
                </p>
              </div>
              {!isPro && (
                <Link
                  role="menuitem"
                  tabIndex={-1}
                  href="/account"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-primary to-accent-violet px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm outline-none hover:brightness-110 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <SparklesIcon className="h-3.5 w-3.5" />
                  Upgrade
                </Link>
              )}
            </div>
          </div>

          <div className="my-1 border-t border-border" />

          <div className="py-1">
            {supportLinks.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                role="menuitem"
                tabIndex={-1}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-text outline-none transition-colors hover:bg-surface focus-visible:bg-surface"
              >
                <Icon className="h-4 w-4 text-text-muted" />
                {label}
              </Link>
            ))}
          </div>

          <div className="my-1 border-t border-border" />

          <button
            type="button"
            role="menuitem"
            tabIndex={-1}
            onClick={() => void handleSignOut()}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-danger outline-none transition-colors hover:bg-danger/10 focus-visible:bg-danger/10"
          >
            <LogOutIcon className="h-4 w-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
