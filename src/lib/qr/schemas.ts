import { z } from "zod";
import {
  isValidDate,
  isValidEmail,
  isValidLatitude,
  isValidLongitude,
  isValidPhone,
  isValidTime,
  isValidUrl,
} from "@/lib/validation/rules";
import type { QRCodeType, QRDataMap } from "@/types/qr";

const requiredText = (label: string, max: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .max(max, `${label} must be ${max} characters or fewer.`);

const optionalText = (max: number) => z.string().trim().max(max).optional().default("");

export const urlSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, "Enter a URL.")
    .max(2048, "URL must be 2048 characters or fewer.")
    .refine((value) => isValidUrl(value.startsWith("http") ? value : `https://${value}`), {
      message: "Enter a valid URL, e.g. https://example.com",
    }),
});

export const textSchema = z.object({
  text: requiredText("Text", 2000),
});

export const wifiSchema = z
  .object({
    ssid: requiredText("Network name (SSID)", 64),
    password: z.string().max(64, "Password must be 64 characters or fewer.").optional().default(""),
    encryption: z.enum(["WPA", "WEP", "nopass"]).default("WPA"),
    hidden: z.boolean().default(false),
  })
  .refine((data) => data.encryption === "nopass" || data.password.length > 0, {
    message: "Enter a password, or choose “No password”.",
    path: ["password"],
  });

export const emailSchema = z.object({
  to: z
    .string()
    .trim()
    .min(1, "Enter a recipient email address.")
    .refine(isValidEmail, "Enter a valid email address."),
  subject: optionalText(200),
  body: optionalText(2000),
});

export const phoneSchema = z.object({
  phone: z
    .string()
    .trim()
    .min(1, "Enter a phone number.")
    .refine(isValidPhone, "Enter a valid phone number, e.g. +1 555 123 4567"),
});

export const smsSchema = z.object({
  phone: z
    .string()
    .trim()
    .min(1, "Enter a phone number.")
    .refine(isValidPhone, "Enter a valid phone number, e.g. +1 555 123 4567"),
  message: optionalText(400),
});

export const vcardSchema = z.object({
  firstName: requiredText("First name", 100),
  lastName: optionalText(100),
  organization: optionalText(150),
  title: optionalText(150),
  phone: z
    .string()
    .trim()
    .refine((value) => value === "" || isValidPhone(value), "Enter a valid phone number.")
    .optional()
    .default(""),
  email: z
    .string()
    .trim()
    .refine((value) => value === "" || isValidEmail(value), "Enter a valid email address.")
    .optional()
    .default(""),
  website: z
    .string()
    .trim()
    .refine((value) => value === "" || isValidUrl(value.startsWith("http") ? value : `https://${value}`), "Enter a valid website URL.")
    .optional()
    .default(""),
  address: optionalText(200),
});

export const locationSchema = z.object({
  latitude: z
    .string()
    .trim()
    .min(1, "Enter a latitude.")
    .refine(isValidLatitude, "Latitude must be between -90 and 90."),
  longitude: z
    .string()
    .trim()
    .min(1, "Enter a longitude.")
    .refine(isValidLongitude, "Longitude must be between -180 and 180."),
  label: optionalText(150),
});

export const eventSchema = z
  .object({
    title: requiredText("Event title", 150),
    location: optionalText(200),
    description: optionalText(1000),
    startDate: z.string().refine(isValidDate, "Enter a valid start date."),
    startTime: z.string().refine((v) => v === "" || isValidTime(v), "Enter a valid start time.").optional().default(""),
    endDate: z.string().refine((v) => v === "" || isValidDate(v), "Enter a valid end date.").optional().default(""),
    endTime: z.string().refine((v) => v === "" || isValidTime(v), "Enter a valid end time.").optional().default(""),
    allDay: z.boolean().default(false),
  })
  .refine(
    (data) => {
      if (!data.endDate) return true;
      return new Date(data.endDate) >= new Date(data.startDate);
    },
    { message: "End date must be on or after the start date.", path: ["endDate"] },
  );

export const qrSchemaMap = {
  url: urlSchema,
  text: textSchema,
  wifi: wifiSchema,
  email: emailSchema,
  phone: phoneSchema,
  sms: smsSchema,
  vcard: vcardSchema,
  location: locationSchema,
  event: eventSchema,
} as const satisfies Record<QRCodeType, z.ZodType>;

export function validateQRData<T extends QRCodeType>(type: T, data: unknown) {
  const schema = qrSchemaMap[type];
  return schema.safeParse(data);
}

export const defaultQRData: QRDataMap = {
  url: { url: "" },
  text: { text: "" },
  wifi: { ssid: "", password: "", encryption: "WPA", hidden: false },
  email: { to: "", subject: "", body: "" },
  phone: { phone: "" },
  sms: { phone: "", message: "" },
  vcard: {
    firstName: "",
    lastName: "",
    organization: "",
    title: "",
    phone: "",
    email: "",
    website: "",
    address: "",
  },
  location: { latitude: "", longitude: "", label: "" },
  event: {
    title: "",
    location: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    allDay: false,
  },
};
