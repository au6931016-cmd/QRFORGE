import Link from "next/link";
import { Container, Section } from "@/components/ui/Container";

const DASHBOARD_NAV = [
  { href: "/dashboard", label: "My QR Codes" },
  { href: "/dashboard/bulk", label: "Bulk Generate" },
  { href: "/account", label: "Account" },
];

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <Section className="pt-8 sm:pt-10">
      <Container>
        <nav aria-label="Dashboard" className="mb-8 flex gap-1 border-b border-border">
          {DASHBOARD_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="border-b-2 border-transparent px-3 py-2 text-sm font-medium text-text-muted hover:text-text"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        {children}
      </Container>
    </Section>
  );
}
