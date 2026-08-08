import type { QRCodeType } from "@/types/qr";

export type QRFieldType =
  | "text"
  | "textarea"
  | "email"
  | "tel"
  | "url"
  | "select"
  | "checkbox"
  | "date"
  | "time"
  | "number";

export interface QRFieldOption {
  label: string;
  value: string;
}

export interface QRFieldConfig {
  name: string;
  label: string;
  type: QRFieldType;
  placeholder?: string;
  hint?: string;
  required?: boolean;
  maxLength?: number;
  options?: QRFieldOption[];
  /** Only render this field when the predicate over current form data is true. */
  showIf?: (data: Record<string, unknown>) => boolean;
}

export const qrFieldConfig: Record<QRCodeType, QRFieldConfig[]> = {
  url: [
    {
      name: "url",
      label: "Website URL",
      type: "url",
      required: true,
      placeholder: "https://example.com",
      maxLength: 2048,
    },
  ],
  text: [
    {
      name: "text",
      label: "Text",
      type: "textarea",
      required: true,
      placeholder: "Enter any text — a note, code, or message.",
      maxLength: 2000,
    },
  ],
  wifi: [
    { name: "ssid", label: "Network name (SSID)", type: "text", required: true, maxLength: 64 },
    {
      name: "encryption",
      label: "Security",
      type: "select",
      options: [
        { label: "WPA/WPA2/WPA3", value: "WPA" },
        { label: "WEP", value: "WEP" },
        { label: "No password", value: "nopass" },
      ],
    },
    {
      name: "password",
      label: "Password",
      type: "text",
      maxLength: 64,
      showIf: (data) => data.encryption !== "nopass",
    },
    { name: "hidden", label: "Hidden network", type: "checkbox" },
  ],
  email: [
    { name: "to", label: "Recipient email", type: "email", required: true, placeholder: "name@example.com" },
    { name: "subject", label: "Subject", type: "text", maxLength: 200 },
    { name: "body", label: "Message", type: "textarea", maxLength: 2000 },
  ],
  phone: [
    { name: "phone", label: "Phone number", type: "tel", required: true, placeholder: "+1 555 123 4567" },
  ],
  sms: [
    { name: "phone", label: "Phone number", type: "tel", required: true, placeholder: "+1 555 123 4567" },
    { name: "message", label: "Message", type: "textarea", maxLength: 400 },
  ],
  vcard: [
    { name: "firstName", label: "First name", type: "text", required: true, maxLength: 100 },
    { name: "lastName", label: "Last name", type: "text", maxLength: 100 },
    { name: "organization", label: "Company", type: "text", maxLength: 150 },
    { name: "title", label: "Job title", type: "text", maxLength: 150 },
    { name: "phone", label: "Phone", type: "tel" },
    { name: "email", label: "Email", type: "email" },
    { name: "website", label: "Website", type: "url" },
    { name: "address", label: "Address", type: "textarea", maxLength: 200 },
  ],
  location: [
    { name: "latitude", label: "Latitude", type: "text", required: true, placeholder: "40.7128" },
    { name: "longitude", label: "Longitude", type: "text", required: true, placeholder: "-74.0060" },
    { name: "label", label: "Location name", type: "text", maxLength: 150 },
  ],
  event: [
    { name: "title", label: "Event title", type: "text", required: true, maxLength: 150 },
    { name: "location", label: "Location", type: "text", maxLength: 200 },
    { name: "description", label: "Description", type: "textarea", maxLength: 1000 },
    { name: "allDay", label: "All-day event", type: "checkbox" },
    { name: "startDate", label: "Start date", type: "date", required: true },
    {
      name: "startTime",
      label: "Start time",
      type: "time",
      showIf: (data) => !data.allDay,
    },
    { name: "endDate", label: "End date", type: "date" },
    {
      name: "endTime",
      label: "End time",
      type: "time",
      showIf: (data) => !data.allDay,
    },
  ],
};
