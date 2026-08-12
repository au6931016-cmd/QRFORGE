import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function BoltIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  );
}

export function ShieldCheckIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3Z" />
      <path d="M9 12.2 11 14l4-4.2" />
    </svg>
  );
}

export function PaletteIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="9.5" r="5" />
      <circle cx="15" cy="9.5" r="5" />
      <circle cx="12" cy="15" r="5" />
    </svg>
  );
}

export function PrinterIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 9V3h12v6" />
      <rect x="4" y="9" width="16" height="8" rx="1.5" />
      <path d="M8 13h8v7H8z" />
    </svg>
  );
}

export function UtensilsIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 3v7a2 2 0 0 0 4 0V3" />
      <path d="M9 10v11" />
      <path d="M17 3c-1.5 0-3 1.6-3 4s1.5 4 3 4v10" />
    </svg>
  );
}

export function ShoppingBagIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 8h12l-1 12H7L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </svg>
  );
}

export function BuildingIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="3" width="10" height="18" rx="1" />
      <rect x="14" y="8" width="6" height="13" rx="1" />
      <path d="M7 7h1M10 7h1M7 11h1M10 11h1M7 15h1M10 15h1" />
    </svg>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M15.5 14.2A5 5 0 0 1 21 19" />
    </svg>
  );
}

export function MegaphoneIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 10v4a1 1 0 0 0 1 1h2l7 4V5L6 9H4a1 1 0 0 0-1 1Z" />
      <path d="M17 8a4 4 0 0 1 0 8" />
    </svg>
  );
}

export function UserCircleIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="10" r="3" />
      <path d="M6.2 18.5a6 6 0 0 1 11.6 0" />
    </svg>
  );
}

export function QrCodeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3h-3zM20 14v3M14 20h3M20 20v.01" />
    </svg>
  );
}

export function ClockHistoryIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5l2.6 5.3 5.8.85-4.2 4.1 1 5.75L12 16.9l-5.2 2.6 1-5.75-4.2-4.1 5.8-.85L12 3.5Z" />
    </svg>
  );
}

export function LayoutGridIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1" />
    </svg>
  );
}

export function SettingsGearIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 13.5a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.04 1.56V19.5a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.04-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.04H4.5a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.56-1.04 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H10.6a1.7 1.7 0 0 0 1.04-1.56V4.5a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.04 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V10.6c.14.62.6 1.13 1.56 1.04H19.5a2 2 0 1 1 0 4h-.09c-.62-.14-1.13.32-1.04 1.56Z" />
    </svg>
  );
}

export function HelpCircleIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.2a2.5 2.5 0 0 1 4.9.8c0 1.6-2.4 2-2.4 3.5" />
      <path d="M12 17.5v.01" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

export function LogOutIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M15 4H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8" />
      <path d="M10 12h11M17.5 8.5 21 12l-3.5 3.5" />
    </svg>
  );
}

export function SparklesIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5 13.6 8l4.4 1.6L13.6 11.2 12 15.7 10.4 11.2 6 9.6 10.4 8 12 3.5Z" />
      <path d="M18.5 15.5 19.5 18l2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1 1-2.5Z" />
    </svg>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v12m0 0-4-4m4 4 4-4" />
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </svg>
  );
}

export function CopyIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
