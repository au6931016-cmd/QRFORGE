import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          backgroundImage: "linear-gradient(135deg, #EFF6FF 0%, #ffffff 60%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              width: 96,
              height: 96,
              borderRadius: 20,
              backgroundColor: "#2563EB",
            }}
          />
          <div style={{ fontSize: 72, fontWeight: 700, color: "#0F172A" }}>
            {siteConfig.name}
          </div>
        </div>
        <div style={{ marginTop: 28, fontSize: 32, color: "#475569" }}>
          {siteConfig.tagline}
        </div>
      </div>
    ),
    { ...size },
  );
}
