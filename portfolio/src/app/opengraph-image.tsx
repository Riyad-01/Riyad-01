import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const dynamic = "force-static";
export const alt = `${site.name} — ${site.role}. From human needs to working systems.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#060c15", color: "#f3efe6", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", fontSize: 24, letterSpacing: 3, textTransform: "uppercase", color: "#5fe0d0" }}>{site.role}</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 104, fontWeight: 800, lineHeight: 0.95, letterSpacing: -4, textTransform: "uppercase" }}>
          <span>From human needs</span>
          <span style={{ color: "#5fe0d0" }}>to working systems.</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#c3cedb" }}>
          <span>{site.name}</span>
          <span>1,500–2,000+ courses · 20–25 UK brands · 15–20 people led</span>
        </div>
      </div>
    ),
    size,
  );
}
