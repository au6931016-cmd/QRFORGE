/**
 * Framework-agnostic validation primitives used by the QR schemas and forms.
 * Kept dependency-free (no regex catastrophes, no external validators) so
 * behavior is predictable and easy to unit test.
 */

export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

export function isWithinLength(value: string, max: number, min = 0): boolean {
  const len = value.trim().length;
  return len >= min && len <= max;
}

const URL_PATTERN = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;

export function isValidUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!URL_PATTERN.test(trimmed)) return false;
  try {
    // Throws on malformed input; also guards against `javascript:` etc.
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

const PHONE_PATTERN = /^\+?[0-9()\-.\s]{7,20}$/;

export function isValidPhone(value: string): boolean {
  const trimmed = value.trim();
  if (!PHONE_PATTERN.test(trimmed)) return false;
  const digitCount = trimmed.replace(/\D/g, "").length;
  return digitCount >= 7 && digitCount <= 15;
}

export function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00`);
  return !Number.isNaN(date.getTime());
}

export function isValidTime(value: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

export function isValidLatitude(value: string): boolean {
  const num = Number(value);
  return value.trim() !== "" && Number.isFinite(num) && num >= -90 && num <= 90;
}

export function isValidLongitude(value: string): boolean {
  const num = Number(value);
  return value.trim() !== "" && Number.isFinite(num) && num >= -180 && num <= 180;
}

export function isValidHexColor(value: string): boolean {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim());
}

const CONTROL_CHAR_ALLOWLIST = new Set([9, 10, 13]); // tab, LF, CR

/**
 * Strips control characters that have no legitimate place in plain-text QR
 * payload fields, while leaving normal punctuation/unicode text untouched.
 * This is not HTML sanitization — QR payloads are rendered as an image,
 * never injected as HTML — it just guards against malformed/garbled scans.
 */
export function sanitizePlainText(value: string): string {
  let result = "";
  for (const char of value) {
    const code = char.codePointAt(0) ?? 0;
    const isControl =
      (code <= 31 && !CONTROL_CHAR_ALLOWLIST.has(code)) || (code >= 127 && code <= 159);
    if (!isControl) result += char;
  }
  return result.trim();
}
