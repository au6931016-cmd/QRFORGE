import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <span
        aria-hidden="true"
        className="grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-primary to-accent-violet text-primary-foreground shadow-sm shadow-primary/30"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor" />
          <rect x="11" y="1" width="6" height="6" rx="1" fill="currentColor" />
          <rect x="1" y="11" width="6" height="6" rx="1" fill="currentColor" />
          <rect x="11" y="11" width="2.5" height="2.5" rx="0.5" fill="currentColor" />
          <rect x="14.5" y="11" width="2.5" height="2.5" rx="0.5" fill="currentColor" />
          <rect x="11" y="14.5" width="2.5" height="2.5" rx="0.5" fill="currentColor" />
        </svg>
      </span>
      <span className="text-lg font-semibold tracking-tight text-text">{siteConfig.name}</span>
    </Link>
  );
}
