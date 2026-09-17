import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        background: "#0A0A0A",
        padding: 96,
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: 4,
          color: "#FFD60A",
          textTransform: "uppercase",
          marginBottom: 24,
        }}
      >
        BearAi
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 76,
          fontWeight: 900,
          color: "#FFFFFF",
          lineHeight: 1.1,
          letterSpacing: -2,
          maxWidth: 900,
        }}
      >
        AI Video Script &amp; Prompt Generator
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 28,
          color: "#A3A3A3",
          marginTop: 32,
          maxWidth: 800,
        }}
      >
        From idea to shot-ready AI video prompts — instantly.
      </div>
    </div>,
    { ...size },
  );
}
