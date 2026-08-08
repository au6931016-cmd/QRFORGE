import type { BlogPost } from "@/types/blog";

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-create-a-qr-code",
    title: "How to Create a QR Code (Step by Step)",
    description:
      "A complete walkthrough for creating your first QR code — choosing a type, customizing it, and making sure it actually scans.",
    author: "QRForge Team",
    publishedDate: "2026-01-12",
    updatedDate: "2026-01-12",
    category: "Guides",
    tags: ["basics", "getting-started"],
    relatedTools: ["url"],
    relatedSlugs: ["how-qr-codes-work", "how-to-test-a-qr-code"],
    content: [
      {
        kind: "paragraph",
        text: "Creating a QR code takes less than a minute, but a few small decisions early on determine whether it scans reliably once it's printed or published. Here's the process we'd recommend, whether you're linking to a website, sharing Wi-Fi access, or building a digital business card.",
      },
      { kind: "heading", text: "1. Decide what the QR code should do" },
      {
        kind: "paragraph",
        text: "QR codes aren't just links — they can open a pre-filled email, dial a phone number, join a Wi-Fi network, save a contact, or add an event to a calendar. Picking the right type up front means you fill in fewer fields and get a more reliable result than trying to cram everything into a generic text code.",
      },
      { kind: "heading", text: "2. Fill in accurate, final data" },
      {
        kind: "paragraph",
        text: "Because a standard QR code is static, whatever you encode is permanent. Double-check URLs for typos, confirm Wi-Fi passwords are current, and make sure phone numbers include the right country code if the code might be scanned internationally.",
      },
      { kind: "heading", text: "3. Customize with contrast in mind" },
      {
        kind: "paragraph",
        text: "Custom colors and a logo make a QR code feel like part of your brand, but scanners rely on contrast between the foreground and background to lock onto the pattern. Keep dark modules on a light background (or vice versa), and avoid placing a large logo directly over the code's corner markers.",
      },
      { kind: "heading", text: "4. Test before you publish" },
      {
        kind: "paragraph",
        text: "Scan the code yourself with at least two different phones before printing it at scale or publishing it online. Test at the actual size it will appear — a code that scans fine on a laptop screen can behave differently printed at two centimeters wide.",
      },
      {
        kind: "callout",
        tone: "info",
        text: "Every QR code generated on this site is created entirely in your browser — your data is never uploaded to a server.",
      },
    ],
  },
  {
    slug: "how-qr-codes-work",
    title: "How QR Codes Work, Explained Simply",
    description:
      "A plain-English look at what's actually happening inside a QR code — modules, error correction, and why they still scan when partly damaged.",
    author: "QRForge Team",
    publishedDate: "2026-01-15",
    updatedDate: "2026-01-15",
    category: "Education",
    tags: ["basics", "how-it-works"],
    relatedSlugs: ["how-to-create-a-qr-code", "are-qr-codes-safe"],
    content: [
      {
        kind: "paragraph",
        text: "A QR (Quick Response) code is a two-dimensional barcode: a grid of black and white squares, called modules, that encode data in both directions instead of the single line a traditional barcode uses. That's what lets a QR code pack in far more information — a whole web address, or a complete contact card — in a small printed area.",
      },
      { kind: "heading", text: "The parts of a QR code" },
      {
        kind: "list",
        items: [
          "Finder patterns — the three large squares in three corners that let a scanner detect the code's position and orientation instantly.",
          "Timing patterns — alternating dark and light modules that help the scanner measure the grid's exact size.",
          "Data modules — the actual encoded information, laid out according to the QR specification.",
          "Error correction modules — redundant data that lets the code stay readable even if part of it is damaged or obscured.",
        ],
      },
      { kind: "heading", text: "Why QR codes survive scratches and smudges" },
      {
        kind: "paragraph",
        text: "QR codes use Reed-Solomon error correction, the same family of math used in CDs and satellite communication. Depending on the error correction level chosen when the code is generated, a QR code can lose anywhere from about 7% to 30% of its modules and still decode correctly. That's also what makes it safe to place a small logo in the center of a code — the error correction data fills in what the logo covers.",
      },
      { kind: "heading", text: "What actually gets encoded" },
      {
        kind: "paragraph",
        text: "The visual pattern doesn't store a picture or a live connection — it stores text. A URL QR code encodes the literal characters of a web address; scanning it just means your phone's camera reads that text and recognizes it as a link. That's true for every type: Wi-Fi credentials, calendar events, and contact cards are all just structured text under the hood.",
      },
    ],
  },
  {
    slug: "how-to-create-a-wifi-qr-code",
    title: "How to Create a Wi-Fi QR Code for Your Home or Business",
    description:
      "Skip typing passwords for guests. Here's how Wi-Fi QR codes work and how to set one up correctly the first time.",
    author: "QRForge Team",
    publishedDate: "2026-01-20",
    updatedDate: "2026-01-20",
    category: "Guides",
    tags: ["wifi", "guides"],
    relatedTools: ["wifi"],
    relatedSlugs: ["how-to-create-a-restaurant-qr-menu", "static-vs-dynamic-qr-codes"],
    content: [
      {
        kind: "paragraph",
        text: "Reading out a Wi-Fi password character by character is a small but very common friction point — for cafes, offices, and Airbnb hosts alike. A Wi-Fi QR code solves this: scan it, and the network joins automatically.",
      },
      { kind: "heading", text: "What you'll need" },
      {
        kind: "list",
        items: [
          "Your exact network name (SSID), matching capitalization",
          "Your Wi-Fi password",
          "The security type your router uses — almost always WPA/WPA2/WPA3 on modern routers",
        ],
      },
      { kind: "heading", text: "Should you use your main network?" },
      {
        kind: "paragraph",
        text: "If you're sharing access publicly — a printed card on a cafe table, for instance — consider setting up a separate guest network first. Most routers support this natively, and it keeps your primary network (and anything connected to it) separated from guest devices.",
      },
      { kind: "heading", text: "Placing the printed code" },
      {
        kind: "paragraph",
        text: "Put it somewhere people will naturally look when they want Wi-Fi: a table tent, a welcome binder, or near the router itself. Print it large enough to scan comfortably from arm's length — around 3–4 cm per side is a reasonable minimum for typical viewing distances.",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "If you change your Wi-Fi password later, this code stops working — you'll need to generate and reprint a new one.",
      },
    ],
  },
  {
    slug: "how-to-create-a-restaurant-qr-menu",
    title: "How to Create a QR Code Restaurant Menu",
    description:
      "A practical guide to putting your menu online and linking it with a QR code — including layout and print tips.",
    author: "QRForge Team",
    publishedDate: "2026-01-24",
    updatedDate: "2026-01-24",
    category: "Business",
    tags: ["restaurant", "business use cases"],
    relatedTools: ["url"],
    relatedSlugs: ["how-to-create-a-wifi-qr-code", "how-to-print-a-qr-code"],
    content: [
      {
        kind: "paragraph",
        text: "QR code menus became common out of necessity, but many venues have kept them because they're cheaper to update than reprinting physical menus every time a price or dish changes. Here's how to set one up properly.",
      },
      { kind: "heading", text: "1. Put your menu somewhere stable" },
      {
        kind: "paragraph",
        text: "Host your menu as a normal web page — a simple page on your existing website works well. Avoid linking directly to a PDF if you can help it; PDFs are often harder to read on small phone screens than a responsive web page.",
      },
      { kind: "heading", text: "2. Generate a URL QR code" },
      {
        kind: "paragraph",
        text: "Use a URL QR code pointing at that menu page. Since it's a static code, treat the link itself as the stable part — if you need to change what's on the menu, update the page, not the QR code.",
      },
      { kind: "heading", text: "3. Design for the table, not the screen" },
      {
        kind: "list",
        items: [
          "Print at a size that scans comfortably from a seated position, typically 3–5 cm per side.",
          "Use a short, clear label like \"Scan for menu\" next to the code.",
          "Choose colors with strong contrast — a cute pastel-on-pastel palette can hurt scan reliability.",
        ],
      },
      { kind: "heading", text: "4. Test on the actual table cards" },
      {
        kind: "paragraph",
        text: "Print a sample, put it on an actual table, and scan it in the lighting your dining room actually has — glossy laminate under bright downlights can cause glare that a screen preview won't show you.",
      },
    ],
  },
  {
    slug: "static-vs-dynamic-qr-codes",
    title: "Static vs. Dynamic QR Codes: What's the Difference?",
    description:
      "Understand the real difference between static and dynamic QR codes before you choose — and why most use cases don't need dynamic.",
    author: "QRForge Team",
    publishedDate: "2026-01-28",
    updatedDate: "2026-01-28",
    category: "Education",
    tags: ["static", "dynamic", "education"],
    relatedSlugs: ["how-qr-codes-work", "how-to-create-a-qr-code"],
    content: [
      {
        kind: "paragraph",
        text: "You'll see \"static\" and \"dynamic\" used a lot when shopping for QR code tools, and the distinction matters more than most marketing pages explain.",
      },
      { kind: "heading", text: "Static QR codes" },
      {
        kind: "paragraph",
        text: "A static QR code encodes its destination or data directly in the pattern itself. Once generated, that data is permanent — there's no server in the middle to redirect it elsewhere. Every QR code you create on this site today is static. They're simple, free to generate in unlimited numbers, and never expire or depend on a third-party service staying online.",
      },
      { kind: "heading", text: "Dynamic QR codes" },
      {
        kind: "paragraph",
        text: "A dynamic QR code instead encodes a short redirect link. The QR code itself never changes, but the destination it points to can be updated at any time through a dashboard — and usually comes with scan analytics. The tradeoff is that dynamic codes depend on the provider's redirect service staying online indefinitely; if that service shuts down, every printed code pointing at it breaks at once.",
      },
      { kind: "heading", text: "Which should you use?" },
      {
        kind: "paragraph",
        text: "If your destination is genuinely permanent — a Wi-Fi password, a contact card, a fixed page you control — a static code is simpler and has no ongoing dependency. Dynamic codes earn their complexity when you need to change the destination after printing (say, a seasonal campaign) or want scan-count analytics.",
      },
      {
        kind: "callout",
        tone: "info",
        text: "We're building a dynamic QR system, but it isn't active yet. We won't call anything \"dynamic\" here until it genuinely is — see our roadmap for details.",
      },
    ],
  },
  {
    slug: "how-to-print-a-qr-code",
    title: "How to Print a QR Code So It Actually Scans",
    description:
      "Sizing, contrast, materials, and placement — the practical details that determine whether a printed QR code works.",
    author: "QRForge Team",
    publishedDate: "2026-02-02",
    updatedDate: "2026-02-02",
    category: "Guides",
    tags: ["printing", "guides"],
    relatedSlugs: ["how-to-test-a-qr-code", "how-to-create-a-restaurant-qr-menu"],
    content: [
      {
        kind: "paragraph",
        text: "A QR code that scans perfectly on screen can fail once it's printed, laminated, or placed behind glass. These are the details that most often cause print failures.",
      },
      { kind: "heading", text: "Sizing rule of thumb" },
      {
        kind: "paragraph",
        text: "A common guideline is that a QR code should be at least 1/10th the expected scanning distance. A code meant to be scanned from about a meter away should be roughly 10 cm per side; a code on a business card, scanned from 15–20 cm, can be smaller — but rarely below 2 cm.",
      },
      { kind: "heading", text: "Keep the quiet zone" },
      {
        kind: "paragraph",
        text: "The blank margin around a QR code — the \"quiet zone\" — isn't decorative. Scanners use it to distinguish the code from its surroundings. Don't crop tightly around the code or place other graphics directly against its edge.",
      },
      { kind: "heading", text: "Materials and finish" },
      {
        kind: "list",
        items: [
          "Matte finishes generally scan more reliably than high-gloss laminate, which can create glare under direct light.",
          "Avoid printing over textured or curved surfaces where possible — distortion can confuse the scanner.",
          "If printing in a single color, make sure it's dark enough against the background; mid-tone grays often fail.",
        ],
      },
      { kind: "heading", text: "Always proof before a full print run" },
      {
        kind: "paragraph",
        text: "Print one physical copy at final size and material, then test it with several different phones in the actual lighting conditions it will be used in — before committing to hundreds of copies.",
      },
    ],
  },
  {
    slug: "how-to-test-a-qr-code",
    title: "How to Test a QR Code Before You Publish It",
    description:
      "A short pre-flight checklist for confirming a QR code works — before it goes on packaging, signage, or print.",
    author: "QRForge Team",
    publishedDate: "2026-02-06",
    updatedDate: "2026-02-06",
    category: "Guides",
    tags: ["testing", "guides"],
    relatedSlugs: ["how-to-print-a-qr-code", "how-to-create-a-qr-code"],
    content: [
      {
        kind: "paragraph",
        text: "Testing takes two minutes and catches the vast majority of QR code problems before they become expensive — especially once a code is printed on packaging or large-format signage.",
      },
      { kind: "heading", text: "The checklist" },
      {
        kind: "list",
        ordered: true,
        items: [
          "Scan it with your phone's native camera app, not just a dedicated QR reader — that's what most people will actually use.",
          "Test on at least one iPhone and one Android device; camera software differs between them.",
          "Confirm the destination is correct — not just that it opens something, but that it opens the right thing.",
          "Check it at the actual print size, not zoomed in on a screen.",
          "For static codes, re-scan after any edit to your source data (e.g. a changed Wi-Fi password) to catch stale content.",
        ],
      },
      { kind: "heading", text: "If it doesn't scan" },
      {
        kind: "paragraph",
        text: "Most failures trace back to contrast, size, or a damaged quiet zone. Increase contrast between foreground and background first — it's the single most common fix — then check that nothing (a logo, a border, cropping) is encroaching on the code's edges.",
      },
    ],
  },
  {
    slug: "how-to-create-a-qr-code-for-a-business-card",
    title: "How to Create a QR Code for a Business Card",
    description:
      "Turn a paper business card into a one-scan digital contact save with a vCard QR code.",
    author: "QRForge Team",
    publishedDate: "2026-02-10",
    updatedDate: "2026-02-10",
    category: "Business",
    tags: ["vcard", "business use cases"],
    relatedTools: ["vcard"],
    relatedSlugs: ["how-to-create-a-qr-code", "how-to-use-qr-codes-for-marketing"],
    content: [
      {
        kind: "paragraph",
        text: "A vCard QR code lets someone save your contact details to their phone in one scan, instead of manually typing your name, number, and email after a conversation — when it's most likely to get forgotten.",
      },
      { kind: "heading", text: "What to include" },
      {
        kind: "paragraph",
        text: "Stick to what you'd want on a printed card: name, company, title, phone, email, and website. Adding a full mailing address is optional and often unnecessary for a networking card.",
      },
      { kind: "heading", text: "Where to place it" },
      {
        kind: "paragraph",
        text: "On a physical card, a corner placement around 1.5–2 cm per side is usually enough, since it's scanned up close. If you're adding the same code to a digital signature or a presentation slide, you have more room to make it larger and easier to scan from a screen-to-screen distance.",
      },
      { kind: "heading", text: "Keep it current" },
      {
        kind: "paragraph",
        text: "Because the code is static, a job change or new phone number means generating (and reprinting) a new code. Many people keep a digital version — in an email signature or LinkedIn profile — precisely because it's easier to swap out than a box of printed cards.",
      },
    ],
  },
  {
    slug: "how-to-use-qr-codes-for-marketing",
    title: "How to Use QR Codes for Marketing (Without Annoying Anyone)",
    description:
      "Practical placement ideas and mistakes to avoid when adding QR codes to campaigns, packaging, and print ads.",
    author: "QRForge Team",
    publishedDate: "2026-02-14",
    updatedDate: "2026-02-14",
    category: "Business",
    tags: ["marketing", "business use cases"],
    relatedSlugs: ["static-vs-dynamic-qr-codes", "are-qr-codes-safe"],
    content: [
      {
        kind: "paragraph",
        text: "QR codes work best in marketing when they remove friction rather than add a task. The strongest use cases share one trait: the scan gets someone something they already wanted, faster than typing it manually would.",
      },
      { kind: "heading", text: "Good use cases" },
      {
        kind: "list",
        items: [
          "Packaging that links to setup instructions or a warranty registration page",
          "Print ads that link to a landing page tailored to that specific campaign",
          "Event signage that adds the schedule directly to attendees' calendars",
          "Product tags linking to reviews, sizing guides, or restock notifications",
        ],
      },
      { kind: "heading", text: "Mistakes that hurt conversion" },
      {
        kind: "list",
        items: [
          "Linking to a homepage instead of a page relevant to the specific ad or product",
          "Sending mobile scanners to a page that isn't mobile-friendly",
          "Making the code too small to scan comfortably at typical viewing distance",
          "Giving no reason to scan — always pair the code with a short, specific call to action",
        ],
      },
      { kind: "heading", text: "Set expectations honestly" },
      {
        kind: "paragraph",
        text: "Tell people what they'll get before they scan (\"Scan for care instructions\" beats a bare code with no label). It sets expectations and noticeably improves scan rates compared to an unlabeled code.",
      },
    ],
  },
  {
    slug: "are-qr-codes-safe",
    title: "Are QR Codes Safe? What to Know Before You Scan",
    description:
      "QR codes themselves aren't dangerous, but scanning one blindly can be. Here's what's actually at risk and how to scan safely.",
    author: "QRForge Team",
    publishedDate: "2026-02-18",
    updatedDate: "2026-02-18",
    category: "Security",
    tags: ["security", "safety"],
    relatedSlugs: ["how-qr-codes-work", "how-to-use-qr-codes-for-marketing"],
    content: [
      {
        kind: "paragraph",
        text: "A QR code is just an encoding format — it's no more inherently dangerous than a printed web address. The risk isn't the pattern itself; it's that a QR code hides its destination until after you scan it, which is exactly what makes it a useful vector for phishing when someone has bad intentions.",
      },
      { kind: "heading", text: "What can actually go wrong" },
      {
        kind: "list",
        items: [
          "A malicious QR code links to a phishing page designed to steal login details or payment information.",
          "Fraudulent QR stickers have been placed over legitimate ones on parking meters and public posters, redirecting scans elsewhere.",
          "A code can pre-fill an SMS, call, or email to a scammer's number rather than the business you expect.",
        ],
      },
      { kind: "heading", text: "How to scan safely" },
      {
        kind: "list",
        ordered: true,
        items: [
          "Check the URL preview your camera app shows before tapping through, and look for a domain you recognize.",
          "Be cautious of QR codes in public places that look like a sticker placed over another code.",
          "Avoid entering sensitive information (passwords, card numbers) on a page reached via QR code unless you're confident of its source.",
          "Treat an unexpected QR code (e.g. in an unsolicited email or text) the same way you'd treat an unexpected link.",
        ],
      },
      {
        kind: "callout",
        tone: "warning",
        text: "No generator — including this one — can guarantee that a destination is safe or detect every malicious URL. Always verify the destination yourself before sharing a QR code widely.",
      },
    ],
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getRecentPosts(limit: number): BlogPost[] {
  return [...blogPosts]
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
    .slice(0, limit);
}
