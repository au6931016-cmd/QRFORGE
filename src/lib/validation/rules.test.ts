import { describe, expect, it } from "vitest";
import {
  isValidDate,
  isValidEmail,
  isValidHexColor,
  isValidLatitude,
  isValidLongitude,
  isValidPhone,
  isValidTime,
  isValidUrl,
  isWithinLength,
  sanitizePlainText,
} from "@/lib/validation/rules";

describe("isValidUrl", () => {
  it("accepts well-formed http(s) URLs", () => {
    expect(isValidUrl("https://example.com")).toBe(true);
    expect(isValidUrl("http://example.com/path?query=1")).toBe(true);
  });

  it("rejects non-http(s) protocols and malformed input", () => {
    expect(isValidUrl("javascript:alert(1)")).toBe(false);
    expect(isValidUrl("not a url")).toBe(false);
    expect(isValidUrl("")).toBe(false);
  });
});

describe("isValidEmail", () => {
  it("accepts standard email addresses", () => {
    expect(isValidEmail("name@example.com")).toBe(true);
  });

  it("rejects malformed email addresses", () => {
    expect(isValidEmail("not-an-email")).toBe(false);
    expect(isValidEmail("name@")).toBe(false);
  });
});

describe("isValidPhone", () => {
  it("accepts numbers with 7-15 digits", () => {
    expect(isValidPhone("+1 555 123 4567")).toBe(true);
    expect(isValidPhone("5551234")).toBe(true);
  });

  it("rejects numbers that are too short", () => {
    expect(isValidPhone("12345")).toBe(false);
  });
});

describe("isValidDate / isValidTime", () => {
  it("validates ISO dates", () => {
    expect(isValidDate("2026-03-10")).toBe(true);
    expect(isValidDate("2026-13-40")).toBe(false);
    expect(isValidDate("not-a-date")).toBe(false);
  });

  it("validates 24-hour times", () => {
    expect(isValidTime("09:30")).toBe(true);
    expect(isValidTime("25:00")).toBe(false);
  });
});

describe("isValidLatitude / isValidLongitude", () => {
  it("enforces coordinate ranges", () => {
    expect(isValidLatitude("40.7128")).toBe(true);
    expect(isValidLatitude("91")).toBe(false);
    expect(isValidLongitude("-74.0060")).toBe(true);
    expect(isValidLongitude("-181")).toBe(false);
  });
});

describe("isValidHexColor", () => {
  it("accepts 3 and 6 digit hex colors", () => {
    expect(isValidHexColor("#fff")).toBe(true);
    expect(isValidHexColor("#0F172A")).toBe(true);
  });

  it("rejects invalid hex colors", () => {
    expect(isValidHexColor("blue")).toBe(false);
    expect(isValidHexColor("#12345")).toBe(false);
  });
});

describe("isWithinLength", () => {
  it("checks trimmed length bounds", () => {
    expect(isWithinLength("  hello  ", 10)).toBe(true);
    expect(isWithinLength("hello", 3)).toBe(false);
    expect(isWithinLength("", 10, 1)).toBe(false);
  });
});

describe("sanitizePlainText", () => {
  it("strips control characters while keeping normal text", () => {
    const withControlChar = `hello${String.fromCharCode(7)}world`; // bell character
    expect(sanitizePlainText(withControlChar)).toBe("helloworld");
    expect(sanitizePlainText("hello world")).toBe("hello world");
  });

  it("preserves tabs and newlines", () => {
    expect(sanitizePlainText("line1\nline2\ttabbed")).toBe("line1\nline2\ttabbed");
  });

  it("trims surrounding whitespace", () => {
    expect(sanitizePlainText("  padded  ")).toBe("padded");
  });
});
