import type { QRCodeType, QRCustomization } from "@/types/qr";

export interface QRTemplate {
  id: string;
  name: string;
  description: string;
  type: QRCodeType;
  customizationPreset: Partial<QRCustomization>;
  suggestedLabel?: string;
}

export const qrTemplates: QRTemplate[] = [
  {
    id: "restaurant-menu",
    name: "Restaurant Menu",
    description: "Link diners straight to your digital menu from table cards or window decals.",
    type: "url",
    customizationPreset: {
      foregroundColor: "#7C2D12",
      backgroundColor: "#FFFBEB",
      dotStyle: "rounded",
      cornerSquareStyle: "extra-rounded",
    },
    suggestedLabel: "Scan to view our menu",
  },
  {
    id: "wifi-guest",
    name: "Wi-Fi Guest Access",
    description: "Let guests join your network instantly — no typed passwords.",
    type: "wifi",
    customizationPreset: {
      foregroundColor: "#0F172A",
      backgroundColor: "#FFFFFF",
      dotStyle: "dots",
    },
    suggestedLabel: "Scan to join Wi-Fi",
  },
  {
    id: "business-card",
    name: "Business Card",
    description: "A digital business card that saves your contact details in one scan.",
    type: "vcard",
    customizationPreset: {
      foregroundColor: "#1E3A8A",
      backgroundColor: "#FFFFFF",
      dotStyle: "classy-rounded",
      cornerSquareStyle: "extra-rounded",
    },
  },
  {
    id: "event-invite",
    name: "Event",
    description: "Let invitees add your event straight to their calendar.",
    type: "event",
    customizationPreset: {
      foregroundColor: "#4C1D95",
      backgroundColor: "#F5F3FF",
      dotStyle: "extra-rounded",
    },
    suggestedLabel: "Add to your calendar",
  },
  {
    id: "website-promo",
    name: "Website",
    description: "Send print or packaging traffic straight to your website.",
    type: "url",
    customizationPreset: {
      foregroundColor: "#0F172A",
      backgroundColor: "#FFFFFF",
      dotStyle: "square",
    },
    suggestedLabel: "Visit our website",
  },
  {
    id: "product-info",
    name: "Product",
    description: "Link a product label to specs, manuals, or a buy page.",
    type: "url",
    customizationPreset: {
      foregroundColor: "#166534",
      backgroundColor: "#F0FDF4",
      dotStyle: "rounded",
    },
    suggestedLabel: "Scan for product details",
  },
  {
    id: "contact-support",
    name: "Contact",
    description: "Give customers a one-scan way to call or email support.",
    type: "email",
    customizationPreset: {
      foregroundColor: "#1D4ED8",
      backgroundColor: "#EFF6FF",
      dotStyle: "dots",
    },
    suggestedLabel: "Contact us",
  },
  {
    id: "social-profile",
    name: "Social Media",
    description: "Point followers to your social profile or link-in-bio page.",
    type: "url",
    customizationPreset: {
      foregroundColor: "#BE185D",
      backgroundColor: "#FDF2F8",
      dotStyle: "classy",
    },
    suggestedLabel: "Follow us",
  },
  {
    id: "venue-location",
    name: "Location",
    description: "Give visitors turn-by-turn directions to your venue.",
    type: "location",
    customizationPreset: {
      foregroundColor: "#B45309",
      backgroundColor: "#FFFBEB",
      dotStyle: "rounded",
    },
    suggestedLabel: "Get directions",
  },
  {
    id: "feedback-form",
    name: "Feedback",
    description: "Collect quick feedback by linking to a survey or form.",
    type: "url",
    customizationPreset: {
      foregroundColor: "#0E7490",
      backgroundColor: "#ECFEFF",
      dotStyle: "dots",
    },
    suggestedLabel: "Share your feedback",
  },
];
