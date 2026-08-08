import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { siteConfig } from "@/config/site";
import { footerNav } from "@/data/navigation";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div aria-hidden="true" className="h-1 bg-gradient-to-r from-primary via-accent-violet to-accent-rose" />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-text-muted">
            {siteConfig.description}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-text">Product</h3>
          <ul className="mt-4 space-y-3">
            {footerNav.product.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-text-muted hover:text-primary">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-text">Legal</h3>
          <ul className="mt-4 space-y-3">
            {footerNav.legal.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-text-muted hover:text-primary">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-text-muted sm:flex-row sm:px-6 lg:px-8">
          <p>
            &copy; {year} {siteConfig.name}. All rights reserved.
          </p>
          <p>Free QR code generator — no signup required.</p>
        </div>
      </div>
    </footer>
  );
}
