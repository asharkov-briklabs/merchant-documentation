import { ImageResponse } from "next/og";

export const alt = "VINR Documentation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#05191d",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#97d1d1",
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 9999,
              background: "#2a9d90",
            }}
          />
          VINR Documentation
        </div>
        <div
          style={{
            marginTop: 28,
            color: "#f7fdfc",
            fontSize: 68,
            fontWeight: 700,
            lineHeight: 1.1,
            maxWidth: 900,
          }}
        >
          Build payments that work everywhere.
        </div>
        <div
          style={{
            marginTop: 24,
            color: "rgba(247,253,252,0.6)",
            fontSize: 30,
          }}
        >
          Cards, bank transfers, stablecoins, and local methods — one API.
        </div>
      </div>
    ),
    { ...size }
  );
}
