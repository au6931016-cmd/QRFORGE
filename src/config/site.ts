export const siteConfig = {
  name: "ScanGrid",
  shortName: "ScanGrid",
  tagline: "Free QR Code Generator",
  description:
    "Create, customize, download, and print QR codes in seconds. Free QR code generator for URLs, Wi-Fi, contact cards, events, and more — no signup required.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  logo: "/images/logo.svg",
  ogImage: "/opengraph-image",
  locale: "en_US",
  social: {
    twitter: "https://twitter.com/scangrid",
    facebook: "https://facebook.com/scangrid",
    linkedin: "https://linkedin.com/company/scangrid",
    github: "https://github.com/scangrid",
  },
  contactEmail: "tahirabdullah528@gmail.com",
  supportEmail: "tahirabdullah528@gmail.com",
  legalEmail: "tahirabdullah528@gmail.com",
  seo: {
    defaultTitle: "ScanGrid — Free QR Code Generator",
    defaultDescription:
      "Generate free, high-quality QR codes for URLs, Wi-Fi, contact cards, events, and more. Customize colors, add a logo, and download in PNG or SVG — instantly, in your browser.",
    titleTemplate: "%s | ScanGrid",
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
