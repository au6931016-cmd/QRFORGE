import { describe, expect, it } from "vitest";
import { validateQRData } from "@/lib/qr/schemas";

describe("validateQRData", () => {
  it("rejects an empty URL", () => {
    const result = validateQRData("url", { url: "" });
    expect(result.success).toBe(false);
  });

  it("accepts a valid URL", () => {
    const result = validateQRData("url", { url: "https://example.com" });
    expect(result.success).toBe(true);
  });

  it("requires a Wi-Fi password unless encryption is nopass", () => {
    const missingPassword = validateQRData("wifi", {
      ssid: "Network",
      password: "",
      encryption: "WPA",
      hidden: false,
    });
    expect(missingPassword.success).toBe(false);

    const openNetwork = validateQRData("wifi", {
      ssid: "Network",
      password: "",
      encryption: "nopass",
      hidden: false,
    });
    expect(openNetwork.success).toBe(true);
  });

  it("rejects an invalid email recipient", () => {
    const result = validateQRData("email", { to: "not-an-email", subject: "", body: "" });
    expect(result.success).toBe(false);
  });

  it("rejects out-of-range coordinates", () => {
    const result = validateQRData("location", { latitude: "200", longitude: "0", label: "" });
    expect(result.success).toBe(false);
  });

  it("rejects an event end date before its start date", () => {
    const result = validateQRData("event", {
      title: "Launch",
      location: "",
      description: "",
      startDate: "2026-05-10",
      startTime: "",
      endDate: "2026-05-01",
      endTime: "",
      allDay: true,
    });
    expect(result.success).toBe(false);
  });

  it("accepts a minimal valid event", () => {
    const result = validateQRData("event", {
      title: "Launch",
      location: "",
      description: "",
      startDate: "2026-05-10",
      startTime: "",
      endDate: "",
      endTime: "",
      allDay: true,
    });
    expect(result.success).toBe(true);
  });

  it("requires a first name for vCard", () => {
    const result = validateQRData("vcard", {
      firstName: "",
      lastName: "Lovelace",
      organization: "",
      title: "",
      phone: "",
      email: "",
      website: "",
      address: "",
    });
    expect(result.success).toBe(false);
  });
});
