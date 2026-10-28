import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name}: ${site.focus}`;
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
          justifyContent: "center",
          padding: 80,
          background: "#0d0f13",
          color: "#e8e9ec",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, color: "#7c9bff", letterSpacing: 4 }}>{`USC VITERBI · ECE · ${site.graduation.toUpperCase()}`}</div>
        <div style={{ fontSize: 96, fontWeight: 700, marginTop: 16 }}>{site.name}</div>
        <div style={{ fontSize: 36, color: "#9aa1ad", marginTop: 12 }}>ML · Embedded Systems · Sensors · Robotics</div>
        <div style={{ fontSize: 30, marginTop: 48, display: "flex", gap: 48 }}>
          <span>85% gesture recognition</span>
          <span style={{ color: "#9aa1ad" }}>|</span>
          <span>CURVE research fellow</span>
        </div>
      </div>
    ),
    size,
  );
}
