import type {
  EmailQRData,
  EventQRData,
  LocationQRData,
  PhoneQRData,
  QRCodeType,
  QRDataMap,
  SmsQRData,
  TextQRData,
  UrlQRData,
  VCardQRData,
  WifiQRData,
} from "@/types/qr";

/** Escapes reserved characters for vCard/iCal/MECARD-style field values. */
function escapeField(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,");
}

function buildUrlPayload(data: UrlQRData): string {
  const trimmed = data.url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function buildTextPayload(data: TextQRData): string {
  return data.text;
}

function buildWifiPayload(data: WifiQRData): string {
  const type = data.encryption === "nopass" ? "nopass" : data.encryption;
  const password = data.encryption === "nopass" ? "" : `P:${escapeField(data.password)};`;
  return `WIFI:T:${type};S:${escapeField(data.ssid)};${password}${data.hidden ? "H:true;" : ""};`;
}

function buildEmailPayload(data: EmailQRData): string {
  const params = new URLSearchParams();
  if (data.subject) params.set("subject", data.subject);
  if (data.body) params.set("body", data.body);
  const query = params.toString();
  return `mailto:${data.to}${query ? `?${query}` : ""}`;
}

function buildPhonePayload(data: PhoneQRData): string {
  return `tel:${data.phone.replace(/[^\d+]/g, "")}`;
}

function buildSmsPayload(data: SmsQRData): string {
  const phone = data.phone.replace(/[^\d+]/g, "");
  return data.message ? `SMSTO:${phone}:${data.message}` : `SMSTO:${phone}`;
}

function buildVCardPayload(data: VCardQRData): string {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeField(data.lastName)};${escapeField(data.firstName)};;;`,
    `FN:${escapeField(`${data.firstName} ${data.lastName}`.trim())}`,
  ];
  if (data.organization) lines.push(`ORG:${escapeField(data.organization)}`);
  if (data.title) lines.push(`TITLE:${escapeField(data.title)}`);
  if (data.phone) lines.push(`TEL;TYPE=CELL:${data.phone}`);
  if (data.email) lines.push(`EMAIL:${data.email}`);
  if (data.website) lines.push(`URL:${data.website}`);
  if (data.address) lines.push(`ADR;TYPE=WORK:;;${escapeField(data.address)};;;;`);
  lines.push("END:VCARD");
  return lines.join("\n");
}

function buildLocationPayload(data: LocationQRData): string {
  return `geo:${data.latitude},${data.longitude}${data.label ? `?q=${data.latitude},${data.longitude}(${encodeURIComponent(data.label)})` : ""}`;
}

function toICalDateTime(date: string, time: string, allDay: boolean): string {
  const compactDate = date.replace(/-/g, "");
  if (allDay) return compactDate;
  const compactTime = time ? `${time.replace(":", "")}00` : "000000";
  return `${compactDate}T${compactTime}`;
}

function buildEventPayload(data: EventQRData): string {
  const lines = [
    "BEGIN:VEVENT",
    `SUMMARY:${escapeField(data.title)}`,
    `DTSTART:${toICalDateTime(data.startDate, data.startTime, data.allDay)}`,
    `DTEND:${toICalDateTime(data.endDate || data.startDate, data.endTime || data.startTime, data.allDay)}`,
  ];
  if (data.location) lines.push(`LOCATION:${escapeField(data.location)}`);
  if (data.description) lines.push(`DESCRIPTION:${escapeField(data.description)}`);
  lines.push("END:VEVENT");
  return ["BEGIN:VCALENDAR", "VERSION:2.0", ...lines, "END:VCALENDAR"].join("\n");
}

/**
 * Builds the raw string that gets encoded into the QR code for a given
 * type. This is the single source of truth for payload formatting — forms
 * and previews should never build these strings themselves.
 */
export function buildQRPayload<T extends QRCodeType>(type: T, data: QRDataMap[T]): string {
  switch (type) {
    case "url":
      return buildUrlPayload(data as UrlQRData);
    case "text":
      return buildTextPayload(data as TextQRData);
    case "wifi":
      return buildWifiPayload(data as WifiQRData);
    case "email":
      return buildEmailPayload(data as EmailQRData);
    case "phone":
      return buildPhonePayload(data as PhoneQRData);
    case "sms":
      return buildSmsPayload(data as SmsQRData);
    case "vcard":
      return buildVCardPayload(data as VCardQRData);
    case "location":
      return buildLocationPayload(data as LocationQRData);
    case "event":
      return buildEventPayload(data as EventQRData);
    default: {
      const exhaustiveCheck: never = type;
      throw new Error(`Unsupported QR type: ${String(exhaustiveCheck)}`);
    }
  }
}
