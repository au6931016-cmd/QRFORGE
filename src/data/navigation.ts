export const mainNav = [
  { label: "Home", href: "/" },
  { label: "QR Generator", href: "/qr-code-generator" },
  { label: "QR Tools", href: "/qr-tools" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "About", href: "/about" },
] as const;

export const footerNav = {
  product: [
    { label: "QR Generator", href: "/qr-code-generator" },
    { label: "QR Tools", href: "/qr-tools" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Acceptable Use", href: "/acceptable-use" },
    { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
  ],
} as const;

export const qrTypeNav = [
  { label: "URL", href: "/qr-code-generator/url" },
  { label: "Text", href: "/qr-code-generator/text" },
  { label: "Wi-Fi", href: "/qr-code-generator/wifi" },
  { label: "Email", href: "/qr-code-generator/email" },
  { label: "Phone", href: "/qr-code-generator/phone" },
  { label: "SMS", href: "/qr-code-generator/sms" },
  { label: "vCard", href: "/qr-code-generator/vcard" },
  { label: "Location", href: "/qr-code-generator/location" },
  { label: "Event", href: "/qr-code-generator/event" },
] as const;
