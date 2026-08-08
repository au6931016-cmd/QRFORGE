import type { QRCodeType } from "@/types/qr";

export interface QRTypeMeta {
  type: QRCodeType;
  label: string;
  shortLabel: string;
  description: string;
}

export const qrTypeMeta: Record<QRCodeType, QRTypeMeta> = {
  url: {
    type: "url",
    label: "Website URL",
    shortLabel: "URL",
    description: "Link to any website, landing page, or online profile.",
  },
  text: {
    type: "text",
    label: "Plain Text",
    shortLabel: "Text",
    description: "Encode a note, code, or any block of plain text.",
  },
  wifi: {
    type: "wifi",
    label: "Wi-Fi Network",
    shortLabel: "Wi-Fi",
    description: "Let guests join your Wi-Fi network without typing a password.",
  },
  email: {
    type: "email",
    label: "Email",
    shortLabel: "Email",
    description: "Open a pre-filled email to your address in one scan.",
  },
  phone: {
    type: "phone",
    label: "Phone Number",
    shortLabel: "Phone",
    description: "Let people call a number directly from their camera.",
  },
  sms: {
    type: "sms",
    label: "SMS / Text Message",
    shortLabel: "SMS",
    description: "Start a pre-filled text message to a phone number.",
  },
  vcard: {
    type: "vcard",
    label: "Contact Card (vCard)",
    shortLabel: "vCard",
    description: "Share a digital business card that saves straight to contacts.",
  },
  location: {
    type: "location",
    label: "Location",
    shortLabel: "Location",
    description: "Point to an exact place on the map.",
  },
  event: {
    type: "event",
    label: "Calendar Event",
    shortLabel: "Event",
    description: "Let people add your event to their calendar instantly.",
  },
};
