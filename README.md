# QRForge — Free QR Code Generator

A production-ready, privacy-first QR code generator: create, customize, download, and print QR
codes entirely in the browser. Built with Next.js, TypeScript, and Tailwind CSS.

This README is written for a **non-technical site owner** running the project locally in
Visual Studio Code, plus enough detail for a developer to extend it. If a step says "run this
command," open a terminal in this project folder and paste it in.

---

## 1. Project overview

- **What it is:** A free, no-signup QR code generator supporting 9 QR code types (URL, Text,
  Wi-Fi, Email, Phone, SMS, vCard, Location, Event), with full color/style/logo customization,
  PNG/SVG download, and printing.
- **Where your data goes:** Nowhere. QR codes are generated entirely in the visitor's browser —
  nothing they type is uploaded to a server.
- **What's included beyond the generator:** A blog, legal pages, an SEO-ready page structure,
  a reserved (currently inactive) architecture for future dynamic QR codes, and
  policy-conscious, disabled-by-default advertising and analytics.

## 2. Features

- 9 QR code types, each with its own SEO-friendly page and shared generator engine
- Live preview, color/gradient customization, module & eye shape styles, logo upload, frame & caption
- Built-in scan-safety warnings (contrast, size, logo size) — never claims 100% reliability
- PNG and SVG export at small/medium/large/custom sizes, plus a print-friendly layout
- Ready-made templates (restaurant menu, Wi-Fi guest access, business card, event, etc.)
- Blog with 10 starter articles, legal pages, and an FAQ page
- SEO: per-page metadata, sitemap, robots.txt, JSON-LD structured data
- AdSense-ready ad placements and analytics hooks — both **off by default**
- Cookie/consent banner gating optional analytics and advertising
- Automated tests for QR payload generation, validation, and key UI components

## 3. Technology stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) + [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org) (strict mode)
- [Tailwind CSS v4](https://tailwindcss.com)
- [qr-code-styling](https://github.com/kozakdenys/qr-code-styling) for client-side QR rendering
- [Zod](https://zod.dev) for form/data validation
- [Vitest](https://vitest.dev) + Testing Library for automated tests
- ESLint (flat config) + Prettier-compatible formatting

## 4. Requirements

- [Node.js](https://nodejs.org) version 20.9 or later (includes npm)
- A code editor — [Visual Studio Code](https://code.visualstudio.com) is recommended

Check your Node version:

```bash
node -v
```

## 5. Installation

1. Open this project folder in Visual Studio Code (or your terminal of choice).
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy the environment variable template:

   ```bash
   cp .env.example .env.local
   ```

   (On Windows PowerShell: `Copy-Item .env.example .env.local`)

4. Open `.env.local` and set `NEXT_PUBLIC_SITE_URL` — for local development, the default
   `http://localhost:3000` is fine. Leave everything else blank for now; see [Section 10](#10-optional-integrations)
   for what each variable does.

## 6. Development

Start the local dev server:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser. The site reloads
automatically as you edit files.

Other useful commands during development:

```bash
npm run lint        # check code quality
npm run test         # run the automated test suite once
npm run test:watch   # run tests continuously while developing
```

## 7. Production build

Before deploying, confirm the site builds cleanly:

```bash
npm run build
npm run start
```

`npm run build` compiles the site and type-checks the whole project; `npm run start` serves the
optimized production build locally at [http://localhost:3000](http://localhost:3000) so you can
verify it before deploying.

## 8. Project structure

```
src/
  app/                    Pages and routes (Next.js App Router)
    qr-code-generator/    QR generator hub + one page per QR type
    blog/                 Blog index + [slug] article pages
    about/, contact/, privacy/, terms/, acceptable-use/, affiliate-disclosure/, faq/
    qr-tools/              Ready-made QR templates
    r/[shortCode]/         Reserved for the future dynamic QR system (currently inactive)
    sitemap.ts, robots.ts
  components/
    qr/                    The QR generator, forms, customization, preview, download, print
    layout/                Header, footer, navigation
    ui/                     Reusable design-system primitives (Button, Card, Input, ...)
    ads/                    AdSlot (disabled by default)
    privacy/                Cookie consent provider + banner
    blog/, faq/, seo/, marketing/
  lib/
    qr/                     QR payload encoding, validation schemas, safety checks, download
    validation/             Shared validation rules (URL, email, phone, date, coordinates, ...)
    analytics/               Analytics abstraction (disabled unless configured)
    seo/                     Metadata + JSON-LD helpers
  data/                    Site content: QR type copy, blog posts, templates, FAQs, nav
  config/                  site.ts (brand/config) and ads.ts (ad placement config)
  types/                   Shared TypeScript types
public/                    Static assets
```

## 9. Rebranding the site

All brand details live in one place: **`src/config/site.ts`**. Update the name, tagline,
description, URL, social links, and contact emails there — nothing else in the codebase
hard-codes the brand name. Replace `public/images/logo.svg` (and the inline logo mark in
`src/components/layout/Logo.tsx`) with your own logo when ready.

## 10. Optional integrations

These are all **off by default**. The site works fully without them — they exist as
ready-to-wire hooks for when you need them.

### Google Search Console

1. Deploy the site (see [Section 12](#12-deployment)).
2. In [Google Search Console](https://search.google.com/search-console), add your site as a
   property and verify ownership (the HTML file or meta-tag method both work).
3. Submit your sitemap: `https://your-domain.com/sitemap.xml`.

### Google Analytics

1. Create a Google Analytics 4 property and copy its Measurement ID (`G-XXXXXXXXXX`).
2. Set `NEXT_PUBLIC_ANALYTICS_ID` in your environment variables.
3. Analytics events only fire after a visitor accepts the cookie consent banner.

### Google AdSense

1. Apply for [Google AdSense](https://www.google.com/adsense/) with your live site.
   **AdSense approval is entirely at Google's discretion and depends on Google's current
   publisher policies — this project does not and cannot guarantee approval.**
2. Once approved, set `NEXT_PUBLIC_ADSENSE_CLIENT_ID` to your publisher ID.
3. Set `NEXT_PUBLIC_ADS_ENABLED=true`.
4. Review `src/config/ads.ts` to control which placements are active. Ad placements are
   visually separate from the QR generator and never overlap form fields, buttons, or the QR
   preview, in line with AdSense policy.

### Newsletter and contact forms

Both the newsletter and contact forms are wired to be inert (no fake "success" messages) until
you set `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` / `NEXT_PUBLIC_CONTACT_FORM_ENDPOINT` to an endpoint
that accepts a JSON `POST` request. Point these at your email provider's API or a small
serverless function.

## 11. SEO configuration

- Metadata (titles, descriptions, Open Graph, Twitter cards) is generated per page via
  `src/lib/seo/metadata.ts` and each page's own content in `src/data/`.
- `src/app/sitemap.ts` and `src/app/robots.ts` generate `/sitemap.xml` and `/robots.txt`
  automatically from your actual routes and blog posts — no manual maintenance needed.
- Structured data (JSON-LD) for Organization, WebSite, BreadcrumbList, Article, and FAQPage is
  included where accurate; see `src/lib/seo/json-ld.ts`.

## 12. Deployment

The project deploys to any Node.js-compatible host; [Vercel](https://vercel.com) (built by the
Next.js team) requires the least setup:

1. **Create a repository.** Initialize git and push this project to GitHub/GitLab/Bitbucket:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repository-url>
   git push -u origin main
   ```

2. **Connect hosting.** In Vercel (or your host of choice), import the repository.
3. **Add environment variables.** Copy the values from your `.env.local` into your host's
   environment variable settings (at minimum, set `NEXT_PUBLIC_SITE_URL` to your real domain).
4. **Deploy.** Most hosts auto-detect Next.js and run `npm run build` / `npm run start` for you.
5. **Connect your custom domain** through your host's domain settings, and verify **HTTPS** is
   active (most hosts, including Vercel, provision this automatically).
6. **Submit your sitemap** to Google Search Console (see [Section 10](#10-optional-integrations)) once the
   domain is live.

No deployment-specific assumptions are hard-coded in the app — it runs the same way on any
Next.js-compatible host.

## 13. Future dynamic QR architecture

The route `/r/[shortCode]` is reserved for a future **dynamic QR code** system, where a printed
code's destination could be edited after the fact, with analytics and campaign management. This
is **not active** — every request to that route currently shows a "not live yet" message. The
lookup function (`src/lib/dynamic-qr/lookup.ts`) is a clean stub ready to be connected to a real
database when that feature is built; nothing in this codebase claims a QR code is "dynamic"
before that's genuinely true.

## 14. Testing

```bash
npm run test
```

This runs the automated test suite covering:

- QR payload generation for every QR type (`src/lib/qr/encode.test.ts`)
- Form/data validation rules and schemas (`src/lib/validation/rules.test.ts`, `src/lib/qr/schemas.test.ts`)
- Scan-safety warning logic (`src/lib/qr/safety.test.ts`)
- Key UI behavior: the QR type selector and dynamic form fields
  (`src/components/qr/QRTypeSelector.test.tsx`, `src/components/qr/forms/DynamicQRForm.test.tsx`)

## 15. Troubleshooting

**`npm install` fails or hangs.**
Confirm your Node.js version is 20.9+ (`node -v`). Delete `node_modules` and
`package-lock.json`, then run `npm install` again.

**Port 3000 is already in use.**
Stop whatever else is using it, or run `npm run dev -- -p 3001` to use a different port.

**A QR code won't scan.**
Check the safety warnings shown above the download buttons — usually low contrast, a code
that's too small, or a logo that's too large. Every tool page also has a "Common mistakes"
section specific to that QR type.

**Ads or analytics aren't showing even though I configured them.**
Both are gated behind visitor cookie consent (and analytics/ads never load in development
unless explicitly enabled) — accept the consent banner to see them locally, and confirm
`NEXT_PUBLIC_ADS_ENABLED=true` is set for ads specifically.

**TypeScript or lint errors after editing code.**
Run `npm run lint` and address anything it reports; run `npx tsc --noEmit` for a full type
check. The project is configured with strict TypeScript — this catches most mistakes early.

---

Questions not covered here? Check the inline comments in `src/config/site.ts` and
`src/config/ads.ts` — most day-to-day customization happens in those two files.
