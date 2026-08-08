import { describe, expect, it } from "vitest";
import { buildQRPayload } from "@/lib/qr/encode";

describe("buildQRPayload", () => {
  it("builds a URL payload, adding https:// when missing", () => {
    expect(buildQRPayload("url", { url: "example.com" })).toBe("https://example.com");
    expect(buildQRPayload("url", { url: "https://example.com" })).toBe("https://example.com");
  });

  it("builds a plain text payload verbatim", () => {
    expect(buildQRPayload("text", { text: "Hello, world!" })).toBe("Hello, world!");
  });

  it("builds a WPA Wi-Fi payload", () => {
    const payload = buildQRPayload("wifi", {
      ssid: "MyNetwork",
      password: "secret123",
      encryption: "WPA",
      hidden: false,
    });
    expect(payload).toBe("WIFI:T:WPA;S:MyNetwork;P:secret123;;");
  });

  it("builds an open Wi-Fi payload with no password segment", () => {
    const payload = buildQRPayload("wifi", {
      ssid: "OpenNet",
      password: "",
      encryption: "nopass",
      hidden: false,
    });
    expect(payload).toBe("WIFI:T:nopass;S:OpenNet;;");
  });

  it("escapes special characters in Wi-Fi fields", () => {
    const payload = buildQRPayload("wifi", {
      ssid: "Net;work,name",
      password: "p;a,ss",
      encryption: "WPA",
      hidden: false,
    });
    expect(payload).toContain("S:Net\\;work\\,name;");
    expect(payload).toContain("P:p\\;a\\,ss;");
  });

  it("builds a mailto payload with subject and body", () => {
    const payload = buildQRPayload("email", {
      to: "hello@example.com",
      subject: "Hi there",
      body: "How are you?",
    });
    expect(payload).toBe("mailto:hello@example.com?subject=Hi+there&body=How+are+you%3F");
  });

  it("builds a tel payload, stripping non-numeric characters", () => {
    expect(buildQRPayload("phone", { phone: "+1 (555) 123-4567" })).toBe("tel:+15551234567");
  });

  it("builds an SMSTO payload", () => {
    expect(buildQRPayload("sms", { phone: "555-1234", message: "Hi" })).toBe("SMSTO:5551234:Hi");
    expect(buildQRPayload("sms", { phone: "555-1234", message: "" })).toBe("SMSTO:5551234");
  });

  it("builds a vCard payload with required fields", () => {
    const payload = buildQRPayload("vcard", {
      firstName: "Ada",
      lastName: "Lovelace",
      organization: "Analytical Engines Inc",
      title: "Mathematician",
      phone: "5551234567",
      email: "ada@example.com",
      website: "https://example.com",
      address: "",
    });
    expect(payload).toContain("BEGIN:VCARD");
    expect(payload).toContain("VERSION:3.0");
    expect(payload).toContain("N:Lovelace;Ada;;;");
    expect(payload).toContain("FN:Ada Lovelace");
    expect(payload).toContain("ORG:Analytical Engines Inc");
    expect(payload).toContain("END:VCARD");
  });

  it("builds a geo payload for location", () => {
    const payload = buildQRPayload("location", {
      latitude: "40.7128",
      longitude: "-74.0060",
      label: "New York",
    });
    expect(payload).toBe("geo:40.7128,-74.0060?q=40.7128,-74.0060(New%20York)");
  });

  it("builds an iCalendar payload for an event", () => {
    const payload = buildQRPayload("event", {
      title: "Team Meeting",
      location: "Room 5",
      description: "Weekly sync",
      startDate: "2026-03-10",
      startTime: "09:00",
      endDate: "2026-03-10",
      endTime: "10:00",
      allDay: false,
    });
    expect(payload).toContain("BEGIN:VCALENDAR");
    expect(payload).toContain("SUMMARY:Team Meeting");
    expect(payload).toContain("DTSTART:20260310T090000");
    expect(payload).toContain("DTEND:20260310T100000");
    expect(payload).toContain("END:VCALENDAR");
  });

  it("builds an all-day event payload without a time component", () => {
    const payload = buildQRPayload("event", {
      title: "Conference",
      location: "",
      description: "",
      startDate: "2026-04-01",
      startTime: "",
      endDate: "2026-04-02",
      endTime: "",
      allDay: true,
    });
    expect(payload).toContain("DTSTART:20260401");
    expect(payload).toContain("DTEND:20260402");
    expect(payload).not.toContain("T000000");
  });
});
