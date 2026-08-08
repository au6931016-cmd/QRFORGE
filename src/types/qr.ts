export type QRCodeType =
  | "url"
  | "text"
  | "wifi"
  | "email"
  | "phone"
  | "sms"
  | "vcard"
  | "location"
  | "event";

export const QR_CODE_TYPES: QRCodeType[] = [
  "url",
  "text",
  "wifi",
  "email",
  "phone",
  "sms",
  "vcard",
  "location",
  "event",
];

export interface UrlQRData {
  url: string;
}

export interface TextQRData {
  text: string;
}

export type WifiEncryption = "WPA" | "WEP" | "nopass";

export interface WifiQRData {
  ssid: string;
  password: string;
  encryption: WifiEncryption;
  hidden: boolean;
}

export interface EmailQRData {
  to: string;
  subject: string;
  body: string;
}

export interface PhoneQRData {
  phone: string;
}

export interface SmsQRData {
  phone: string;
  message: string;
}

export interface VCardQRData {
  firstName: string;
  lastName: string;
  organization: string;
  title: string;
  phone: string;
  email: string;
  website: string;
  address: string;
}

export interface LocationQRData {
  latitude: string;
  longitude: string;
  label: string;
}

export interface EventQRData {
  title: string;
  location: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  allDay: boolean;
}

export interface QRDataMap {
  url: UrlQRData;
  text: TextQRData;
  wifi: WifiQRData;
  email: EmailQRData;
  phone: PhoneQRData;
  sms: SmsQRData;
  vcard: VCardQRData;
  location: LocationQRData;
  event: EventQRData;
}

export type DotStyle =
  | "square"
  | "dots"
  | "rounded"
  | "classy"
  | "classy-rounded"
  | "extra-rounded";

export type CornerSquareStyle = "square" | "dot" | "extra-rounded";
export type CornerDotStyle = "square" | "dot";

export type QRSizePreset = "small" | "medium" | "large" | "custom";

export interface QRLogoOptions {
  dataUrl: string | null;
  sizeRatio: number; // 0.1 - 0.4 of QR width
  hideBackgroundDots: boolean;
}

export interface QRCustomization {
  foregroundColor: string;
  backgroundColor: string;
  useGradient: boolean;
  gradientColor: string;
  dotStyle: DotStyle;
  cornerSquareStyle: CornerSquareStyle;
  cornerDotStyle: CornerDotStyle;
  logo: QRLogoOptions;
  frameEnabled: boolean;
  frameLabel: string;
  label: string;
}

export const DEFAULT_CUSTOMIZATION: QRCustomization = {
  foregroundColor: "#0F172A",
  backgroundColor: "#FFFFFF",
  useGradient: false,
  gradientColor: "#2563EB",
  dotStyle: "square",
  cornerSquareStyle: "square",
  cornerDotStyle: "square",
  logo: {
    dataUrl: null,
    sizeRatio: 0.2,
    hideBackgroundDots: true,
  },
  frameEnabled: false,
  frameLabel: "SCAN ME",
  label: "",
};

export const QR_SIZE_PRESETS: Record<Exclude<QRSizePreset, "custom">, number> = {
  small: 300,
  medium: 600,
  large: 1000,
};

export type DownloadFormat = "png" | "svg";
