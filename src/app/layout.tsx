import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/components/auth/AuthContext";
import { ConsentProvider } from "@/components/privacy/ConsentContext";
import { ConsentBanner } from "@/components/privacy/ConsentBanner";
import { ToastProvider } from "@/components/ui/ToastContext";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSession } from "@/lib/auth/get-session";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/json-ld";
import { siteConfig } from "@/config/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.seo.defaultTitle,
    template: siteConfig.seo.titleTemplate,
  },
  description: siteConfig.seo.defaultDescription,
  keywords: [...siteConfig.seo.keywords],
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
    images: [{ url: siteConfig.ogImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
    images: [siteConfig.ogImage],
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { user, profile } = await getSession();

  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col font-sans antialiased">
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        <noscript>
          <div className="bg-warning-bg px-4 py-3 text-center text-sm text-warning">
            JavaScript is required to generate QR codes in your browser. Please enable it to use
            this site.
          </div>
        </noscript>
        <AuthProvider initialUser={user} initialProfile={profile}>
          <ToastProvider>
            <ConsentProvider>
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
              >
                Skip to content
              </a>
              <Header />
              <main id="main-content" className="flex-1">
                {children}
              </main>
              <Footer />
              <ConsentBanner />
            </ConsentProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
