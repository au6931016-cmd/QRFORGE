import type { QRCodeType } from "@/types/qr";

export interface QRTypePageContent {
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  howItWorks: string[];
  features: string[];
  usage: string[];
  commonMistakes: string[];
  faq: { question: string; answer: string }[];
  relatedTypes: QRCodeType[];
}

export const qrTypeContent: Record<QRCodeType, QRTypePageContent> = {
  url: {
    h1: "URL QR Code Generator",
    metaTitle: "Free URL QR Code Generator",
    metaDescription:
      "Turn any website link into a scannable QR code. Customize colors and add a logo, then download as PNG or SVG — free, no signup.",
    intro:
      "Turn any web address into a QR code that opens directly in a visitor's browser. It's the fastest way to bridge a printed flyer, product package, or storefront window to a live web page.",
    howItWorks: [
      "Paste the full web address you want the QR code to open, including https://.",
      "The generator encodes that address as a standard QR payload — the same format read by every modern phone camera.",
      "Customize the look, then download or print. No account or server round-trip is required.",
    ],
    features: [
      "Works with any http:// or https:// link",
      "Live preview updates as you type",
      "Custom colors, module shapes, and logo overlay",
      "PNG and SVG export at multiple sizes",
    ],
    usage: [
      "Always test the destination URL in a browser before generating the code.",
      "Use a short, stable URL — if the link changes later, this static code will keep pointing to the old address.",
      "Leave enough contrast between foreground and background so cameras can lock onto the code quickly.",
    ],
    commonMistakes: [
      "Forgetting the https:// prefix, which can cause some scanners to treat the text as plain text instead of a link.",
      "Linking to a page that later gets deleted or moved — this is a static code and cannot be redirected after printing.",
      "Making the code too small for the distance it will be scanned from.",
    ],
    faq: [
      {
        question: "Can I edit the link after the QR code is printed?",
        answer:
          "Not with a static URL QR code — the address is embedded directly in the code. If you need to update the destination later, a future dynamic QR system (short-link based) would be required.",
      },
      {
        question: "Does this QR code expire?",
        answer: "No. A static URL QR code works for as long as the destination page exists.",
      },
      {
        question: "Will this work with any QR scanner app?",
        answer: "Yes — it uses the standard QR encoding for URLs that every modern phone camera and scanner app understands.",
      },
    ],
    relatedTypes: ["text", "vcard", "wifi"],
  },
  text: {
    h1: "Text QR Code Generator",
    metaTitle: "Free Text QR Code Generator",
    metaDescription:
      "Encode any plain text — notes, codes, instructions — into a QR code. Customize and download free, directly in your browser.",
    intro:
      "Encode any block of plain text — a note, a serial number, instructions, a quote — directly into a QR code. No link, app, or website required; the text appears the moment it's scanned.",
    howItWorks: [
      "Type or paste the text you want encoded.",
      "The generator stores that text directly inside the QR code's data — nothing is uploaded anywhere.",
      "Scanning the code displays the text immediately on the visitor's device.",
    ],
    features: [
      "Supports up to 2,000 characters",
      "Works completely offline once generated",
      "Full color and style customization",
      "PNG and SVG export",
    ],
    usage: [
      "Keep the text concise — longer text produces a denser, harder-to-scan code.",
      "Use plain punctuation; some scanner apps handle special characters inconsistently.",
      "Preview the code at actual print size to confirm it still scans easily.",
    ],
    commonMistakes: [
      "Encoding very long passages, which makes the resulting code dense and difficult to scan from a distance.",
      "Assuming a text QR code opens a link — it only displays the raw text, since no URL is included.",
    ],
    faq: [
      {
        question: "Is there a character limit?",
        answer: "Yes, this tool supports up to 2,000 characters, though shorter text scans more reliably.",
      },
      {
        question: "Can I include line breaks?",
        answer: "Yes, line breaks are preserved and will display as entered when the code is scanned.",
      },
    ],
    relatedTypes: ["url", "event", "vcard"],
  },
  wifi: {
    h1: "Wi-Fi QR Code Generator",
    metaTitle: "Free Wi-Fi QR Code Generator",
    metaDescription:
      "Create a scan-to-connect Wi-Fi QR code for your home, office, or guest network. No app installs or typed passwords — free and instant.",
    intro:
      "Let guests join your Wi-Fi network by scanning a code instead of typing a password. Popular for cafes, offices, Airbnbs, and home guest networks.",
    howItWorks: [
      "Enter your network name (SSID) and password exactly as configured on your router.",
      "Choose the matching security type — most modern routers use WPA/WPA2/WPA3.",
      "Scanning the generated code prompts the phone to join the network automatically, no typing required.",
    ],
    features: [
      "Supports WPA/WPA2/WPA3, WEP, and open (no password) networks",
      "Optional hidden-network flag",
      "Works with iOS and Android native camera apps",
      "Nothing is sent to a server — the password stays in your browser",
    ],
    usage: [
      "Double-check the SSID and password for typos before printing — a wrong character means the code won't connect.",
      "For guest networks, consider using a dedicated guest SSID rather than your main network password.",
      "Print and place the code somewhere guests will actually see it, like an entryway or welcome card.",
    ],
    commonMistakes: [
      "Choosing the wrong encryption type — selecting WEP for a WPA2 network (or vice versa) will prevent the code from connecting.",
      "Sharing a printed Wi-Fi QR code publicly for a network that also protects sensitive devices.",
      "Not updating or reprinting the code after changing the Wi-Fi password.",
    ],
    faq: [
      {
        question: "Is my Wi-Fi password sent anywhere?",
        answer:
          "No. The QR code is generated entirely in your browser — your network name and password are never uploaded or stored.",
      },
      {
        question: "Will this work on both iPhone and Android?",
        answer:
          "Yes, both platforms' native camera apps recognize the Wi-Fi QR format and offer a one-tap \"Join Network\" prompt.",
      },
      {
        question: "What if my network has no password?",
        answer: "Select \"No password\" as the security type and leave the password field empty.",
      },
    ],
    relatedTypes: ["url", "location", "text"],
  },
  email: {
    h1: "Email QR Code Generator",
    metaTitle: "Free Email QR Code Generator",
    metaDescription:
      "Generate a QR code that opens a pre-filled email. Great for support desks, feedback forms, and business cards — free and instant.",
    intro:
      "Generate a QR code that opens a new email pre-filled with your address, subject, and message — perfect for support desks, feedback stations, or business cards.",
    howItWorks: [
      "Enter the recipient email address, and optionally a subject and message.",
      "The generator encodes a standard mailto: link with your details pre-filled.",
      "Scanning opens the visitor's default mail app with everything ready to send.",
    ],
    features: [
      "Pre-fills subject and body text",
      "Works with any mail app that supports mailto: links",
      "Full visual customization",
      "PNG and SVG export",
    ],
    usage: [
      "Keep the subject short and specific so it's clear what the email is for.",
      "Avoid overly long pre-filled messages — leave room for the sender to add their own details.",
      "Test the code on your own phone before publishing it widely.",
    ],
    commonMistakes: [
      "Typos in the recipient address, which silently misroute every message sent through the code.",
      "Assuming every scanner app has a default mail client configured — some devices may not open anything.",
    ],
    faq: [
      {
        question: "Can recipients edit the pre-filled message?",
        answer: "Yes — the subject and body are just a starting point; the sender's mail app lets them edit before sending.",
      },
      {
        question: "Does this send an email automatically?",
        answer: "No. Scanning only opens a pre-filled draft; the person scanning must still tap send.",
      },
    ],
    relatedTypes: ["vcard", "phone", "sms"],
  },
  phone: {
    h1: "Phone Number QR Code Generator",
    metaTitle: "Free Phone Number QR Code Generator",
    metaDescription:
      "Create a tap-to-call QR code for any phone number. Free, instant, and works with any smartphone camera.",
    intro:
      "Let people call a phone number the moment they scan — no dialing, no saving a contact first. Useful for support lines, storefronts, and printed ads.",
    howItWorks: [
      "Enter the phone number, including country code if it will be scanned internationally.",
      "The generator encodes a standard tel: link.",
      "Scanning opens the phone's dialer with the number ready to call.",
    ],
    features: [
      "Works with local and international numbers",
      "One scan, one tap to call",
      "Custom colors, shapes, and logo support",
      "PNG and SVG export",
    ],
    usage: [
      "Include the country code (e.g. +1) if the code may be scanned outside your local area.",
      "Test the code yourself to confirm it dials the correct number.",
      "Pair with a short label like \"Call us\" so the purpose is obvious at a glance.",
    ],
    commonMistakes: [
      "Leaving out the country code for numbers that will be scanned internationally.",
      "Including spaces or symbols the dialer can't interpret — stick to digits, plus a leading +.",
    ],
    faq: [
      {
        question: "Does scanning place the call automatically?",
        answer: "No — it opens the dialer with the number entered. The person scanning still taps call.",
      },
      {
        question: "Can I use an extension number?",
        answer: "Standard tel: links don't reliably support extensions across all devices, so we recommend a direct line where possible.",
      },
    ],
    relatedTypes: ["sms", "email", "vcard"],
  },
  sms: {
    h1: "SMS QR Code Generator",
    metaTitle: "Free SMS QR Code Generator",
    metaDescription:
      "Generate a QR code that starts a pre-filled text message. Great for opt-ins and quick support — free and instant.",
    intro:
      "Generate a QR code that opens a pre-filled text message to a specific number — useful for SMS opt-ins, quick support requests, or event RSVPs.",
    howItWorks: [
      "Enter the destination phone number and, optionally, a pre-filled message.",
      "The generator encodes a standard SMS deep link.",
      "Scanning opens the messaging app with the number and message ready to send.",
    ],
    features: [
      "Optional pre-filled message text",
      "Works with native Messages apps on iOS and Android",
      "Full visual customization",
      "PNG and SVG export",
    ],
    usage: [
      "Keep the pre-filled message short and specific, e.g. a keyword for an SMS opt-in system.",
      "Confirm the destination number belongs to a line that can actually receive texts.",
      "Test on both iPhone and Android — message app behavior can vary slightly.",
    ],
    commonMistakes: [
      "Using a landline or toll-free number that can't receive SMS messages.",
      "Writing a pre-filled message so long it gets truncated by some messaging apps.",
    ],
    faq: [
      {
        question: "Does this send the text automatically?",
        answer: "No. It pre-fills the message in the recipient's messaging app; they must tap send.",
      },
      {
        question: "Can I leave the message blank?",
        answer: "Yes — the code will simply open a new blank message to that number.",
      },
    ],
    relatedTypes: ["phone", "email", "url"],
  },
  vcard: {
    h1: "vCard QR Code Generator (Digital Business Card)",
    metaTitle: "Free vCard QR Code Generator",
    metaDescription:
      "Turn your contact details into a scannable digital business card. Free vCard QR code generator — no app required.",
    intro:
      "Turn your contact details into a digital business card. Scanning saves your name, company, phone, and email straight into the other person's contacts — no app or manual entry required.",
    howItWorks: [
      "Fill in your name, company, title, and any contact details you want to share.",
      "The generator builds a standard vCard record and encodes it into the QR code.",
      "Scanning prompts the recipient's phone to save a new contact with your details pre-filled.",
    ],
    features: [
      "Standard vCard 3.0 format, compatible with iOS and Android contacts",
      "Optional company, title, website, and address fields",
      "Full visual customization, including your own logo",
      "PNG and SVG export for print or digital use",
    ],
    usage: [
      "Double-check phone and email formatting before printing on physical cards.",
      "Keep your organization and title fields concise so they display cleanly in contact apps.",
      "Consider adding this code to your email signature as well as printed materials.",
    ],
    commonMistakes: [
      "Leaving in outdated contact details after a job or phone number change — this is a static code and won't update automatically.",
      "Overcrowding the code with a large logo, which can reduce scan reliability.",
    ],
    faq: [
      {
        question: "What happens when someone scans my vCard code?",
        answer:
          "Their phone recognizes the vCard format and offers to save your details as a new contact — no app installation needed.",
      },
      {
        question: "Can I update my details after printing?",
        answer:
          "Not on the same physical code — since it's static, you would need to generate and reprint a new code with updated details.",
      },
    ],
    relatedTypes: ["email", "phone", "url"],
  },
  location: {
    h1: "Location QR Code Generator",
    metaTitle: "Free Location QR Code Generator",
    metaDescription:
      "Create a QR code that opens exact map coordinates. Great for venues, events, and directions — free and instant.",
    intro:
      "Point people to an exact location on the map. Scanning opens the coordinates in their phone's default maps app, ready for turn-by-turn directions.",
    howItWorks: [
      "Enter the latitude and longitude of the location, and an optional label.",
      "The generator encodes a standard geo: coordinate link.",
      "Scanning opens the device's default maps app centered on that point.",
    ],
    features: [
      "Works with any decimal latitude/longitude pair",
      "Optional location label",
      "Opens in the scanner's preferred maps app (Google Maps, Apple Maps, etc.)",
      "Full visual customization",
    ],
    usage: [
      "Look up precise coordinates from your maps app of choice — right-click or long-press a pin to copy them.",
      "Double-check the coordinates before printing; a small error can point to the wrong building entirely.",
      "Add a short label describing the venue so scanners recognize the destination.",
    ],
    commonMistakes: [
      "Swapping latitude and longitude values, which sends people to a mirrored location on the globe.",
      "Using approximate coordinates instead of a pinpointed address, especially for large venues.",
    ],
    faq: [
      {
        question: "Which maps app opens when this is scanned?",
        answer: "It depends on the device — most phones open their default maps app (Apple Maps on iOS, Google Maps on most Android devices).",
      },
      {
        question: "How do I find exact coordinates?",
        answer: "Open your preferred maps app, find the location, and copy the latitude/longitude shown for that pin.",
      },
    ],
    relatedTypes: ["event", "url", "wifi"],
  },
  event: {
    h1: "Event QR Code Generator",
    metaTitle: "Free Event QR Code Generator",
    metaDescription:
      "Let people add your event to their calendar with one scan. Free calendar QR code generator — no app required.",
    intro:
      "Let people add your event straight to their calendar with a single scan — no manual entry of dates, times, or locations.",
    howItWorks: [
      "Enter the event title, date and time (or mark it all-day), location, and a short description.",
      "The generator builds a standard calendar event record and encodes it into the QR code.",
      "Scanning prompts the recipient's phone to add the event to their calendar app.",
    ],
    features: [
      "Supports timed and all-day events",
      "Optional location and description fields",
      "Standard iCalendar format, compatible with major calendar apps",
      "Full visual customization",
    ],
    usage: [
      "Double-check the date, time, and time zone assumptions before printing invitations.",
      "Keep the description brief — long text can be truncated by some calendar apps.",
      "Test the code yourself on both iPhone and Android before distributing widely.",
    ],
    commonMistakes: [
      "Setting an end date earlier than the start date, which some calendar apps reject.",
      "Forgetting to mark an all-day event as such, leading to an odd single-minute calendar entry.",
    ],
    faq: [
      {
        question: "Does this add the event automatically?",
        answer: "No — scanning opens a pre-filled event in the recipient's calendar app; they still confirm before saving.",
      },
      {
        question: "Can I include a video call link?",
        answer: "Yes, paste it into the description field and it will appear as part of the event notes.",
      },
    ],
    relatedTypes: ["location", "url", "text"],
  },
};
