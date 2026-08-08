export interface GlobalFaqItem {
  question: string;
  answer: string;
}

export const globalFaq: GlobalFaqItem[] = [
  {
    question: "Is this QR code generator really free?",
    answer:
      "Yes. Creating, customizing, downloading, and printing QR codes is free, with no account required for the core generator.",
  },
  {
    question: "Do you store the data I put into my QR code?",
    answer:
      "No. QR codes are generated entirely in your browser. Your URLs, Wi-Fi passwords, and contact details are never uploaded to our servers.",
  },
  {
    question: "Are these QR codes static or dynamic?",
    answer:
      "Static. The data is encoded directly into the code and can't be changed after it's generated. We're building dynamic (editable, trackable) QR codes as a future feature, and will clearly label them once they're live.",
  },
  {
    question: "Do QR codes expire?",
    answer:
      "No — a static QR code works for as long as its encoded destination or data remains valid. It's not tied to a subscription or hosting service that can shut down.",
  },
  {
    question: "Can I add my logo to a QR code?",
    answer:
      "Yes, the customization panel supports uploading a logo, resizing it, and positioning it in the center of the code. Keep it reasonably small to preserve scan reliability.",
  },
  {
    question: "What file formats can I download?",
    answer:
      "PNG and SVG, at small, medium, large, or a custom pixel size.",
  },
  {
    question: "Will a custom-colored QR code still scan reliably?",
    answer:
      "In most cases, yes — as long as there's strong contrast between the foreground and background colors. We show a warning if your color choice risks reducing scan reliability.",
  },
  {
    question: "Can I use these QR codes commercially?",
    answer:
      "Yes, QR codes generated here can be used for personal or commercial purposes, including print, packaging, and marketing materials.",
  },
];
