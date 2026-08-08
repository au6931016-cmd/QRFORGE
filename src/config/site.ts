export const siteConfig = {
  name: "QRForge",
  shortName: "QRForge",
  tagline: "Free QR Code Generator",
  description:
    "Create, customize, download, and print QR codes in seconds. Free QR code generator for URLs, Wi-Fi, contact cards, events, and more — no signup required.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  logo: "/images/logo.svg",
  ogImage: "/opengraph-image",
  locale: "en_US",
  social: {
    twitter: "https://twitter.com/qrforge",
    facebook: "https://facebook.com/qrforge",
    linkedin: "https://linkedin.com/company/qrforge",
    github: "https://github.com/qrforge",
  },
  contactEmail: "hello@qrforge.example",
  supportEmail: "support@qrforge.example",
  legalEmail: "legal@qrforge.example",
  seo: {
    defaultTitle: "QRForge — Free QR Code Generator",
    defaultDescription:
      "Generate free, high-quality QR codes for URLs, Wi-Fi, contact cards, events, and more. Customize colors, add a logo, and download in PNG or SVG — instantly, in your browser.",
    titleTemplate: "%s | QRForge",
    keywords: [
      "qr code generator",
      "free qr code",
      "wifi qr code",
      "vcard qr code",
      "qr code maker",
      "custom qr code",
    ],
  },
} as const;

export type SiteConfig = typeof siteConfig;
