"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/layout/Logo";
import { UserMenu, getDisplayName } from "@/components/layout/UserMenu";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  ClockHistoryIcon,
  HelpCircleIcon,
  LayoutGridIcon,
  LogOutIcon,
  MailIcon,
  QrCodeIcon,
  SettingsGearIcon,
  StarIcon,
  UserCircleIcon,
} from "@/components/icons";
import { useAuth } from "@/components/auth/AuthContext";
import { mainNav } from "@/data/navigation";
import { cn } from "@/lib/utils/cn";

const mobileAccountLinks = [
  { label: "Profile / Account", href: "/account", icon: UserCircleIcon },
  { label: "Saved QR Codes", href: "/dashboard", icon: QrCodeIcon },
  { label: "QR History", href: "/dashboard/history", icon: ClockHistoryIcon },
  { label: "Favorites", href: "/dashboard?filter=favorites", icon: StarIcon },
  { label: "Templates", href: "/qr-tools", icon: LayoutGridIcon },
  { label: "Settings", href: "/account/settings", icon: SettingsGearIcon },
  { label: "Help / FAQ", href: "/faq", icon: HelpCircleIcon },
  { label: "Contact Support", href: "/contact", icon: MailIcon },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isPro, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const displayName = getDisplayName(user);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/95 backdrop-blur supports-[backdrop-filter]:bg-bg/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-surface",
                      active ? "text-primary" : "text-text-muted hover:text-text",
                    )}
                  >
                    {item.label}
                    {active && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-3 -bottom-[1px] h-0.5 rounded-full bg-gradient-to-r from-primary to-accent-violet"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <UserMenu />
          ) : (
            <Link href="/login" className="text-sm font-medium text-text-muted hover:text-text">
              Log in
            </Link>
          )}
          <Link
            href="/qr-code-generator"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-gradient-to-r from-primary to-accent-violet px-4 text-sm font-medium text-primary-foreground shadow-sm shadow-primary/25 transition-all hover:shadow-md hover:shadow-primary/30 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Create QR Code
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-text md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {menuOpen ? (
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-border bg-bg px-4 pb-6 pt-2 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-md px-3 py-3 text-base font-medium text-text hover:bg-surface"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/qr-code-generator" onClick={() => setMenuOpen(false)} className="mt-4 block">
            <Button className="w-full">Create QR Code</Button>
          </Link>
          {user ? (
            <>
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-surface px-3 py-3">
                <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent-violet text-sm font-semibold text-white">
                  {displayName.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-text">{displayName}</div>
                  <div className="truncate text-xs text-text-muted">{user.email}</div>
                </div>
                <Badge tone={isPro ? "violet" : "neutral"}>{isPro ? "Pro" : "Free"}</Badge>
              </div>

              <div className="mt-2 border-t border-border pt-2">
                {mobileAccountLinks.map(({ label, href, icon: Icon }) => (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-md px-3 py-3 text-base font-medium text-text hover:bg-surface"
                  >
                    <Icon className="h-5 w-5 text-text-muted" />
                    {label}
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    void handleSignOut();
                  }}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-base font-medium text-danger hover:bg-danger/10"
                >
                  <LogOutIcon className="h-5 w-5" />
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="mt-3 block rounded-md px-3 py-3 text-base font-medium text-text hover:bg-surface"
            >
              Log in
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
