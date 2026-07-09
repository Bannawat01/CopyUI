import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site";

export const alt =
  "CopyUI — Production-ready UI prompts for v0, Cursor, and GenVibe";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Mock "template card" tiles echoing the gallery's preview mockups.
const CARD_ACCENTS = ["#6366f1", "#0ea5e9", "#ec4899", "#22c55e"];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#050505",
          backgroundImage:
            "radial-gradient(900px 500px at 85% -10%, rgba(99,102,241,0.22), transparent 65%), radial-gradient(700px 400px at -5% 110%, rgba(14,165,233,0.16), transparent 60%)",
          padding: 72,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left: name + tagline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: 640,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 28,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: "#6366f1",
                display: "flex",
              }}
            />
            <div
              style={{
                fontSize: 56,
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: -1,
              }}
            >
              {SITE_NAME}
            </div>
          </div>
          <div
            style={{
              fontSize: 34,
              lineHeight: 1.3,
              color: "rgba(255,255,255,0.75)",
            }}
          >
            Production-ready UI prompts for v0, Cursor, and GenVibe
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 36,
              fontSize: 20,
              color: "rgba(255,255,255,0.45)",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 999,
              padding: "10px 24px",
              alignSelf: "flex-start",
            }}
          >
            Pick a theme · Set your color · Copy the prompt
          </div>
        </div>

        {/* Right: subtle 2x2 template-card grid motif */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            width: 380,
            gap: 20,
          }}
        >
          {CARD_ACCENTS.map((accent) => (
            <div
              key={accent}
              style={{
                display: "flex",
                flexDirection: "column",
                width: 180,
                height: 130,
                borderRadius: 16,
                backgroundColor: "#0c0c0e",
                border: "1px solid rgba(255,255,255,0.12)",
                padding: 14,
                gap: 8,
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: 44,
                  height: 8,
                  borderRadius: 999,
                  backgroundColor: accent,
                }}
              />
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  height: 8,
                  borderRadius: 999,
                  backgroundColor: "rgba(255,255,255,0.14)",
                }}
              />
              <div
                style={{
                  display: "flex",
                  width: "72%",
                  height: 8,
                  borderRadius: 999,
                  backgroundColor: "rgba(255,255,255,0.10)",
                }}
              />
              <div
                style={{
                  display: "flex",
                  marginTop: "auto",
                  width: 64,
                  height: 20,
                  borderRadius: 6,
                  backgroundColor: accent,
                  opacity: 0.85,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
