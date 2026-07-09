import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Same CopyUI mark as icon.tsx, scaled for iOS home-screen tiles. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#0c0c0e",
          backgroundImage:
            "radial-gradient(140% 100% at 100% 0%, rgba(99,102,241,0.30), transparent 60%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 38,
            left: 38,
            width: 78,
            height: 78,
            borderRadius: 20,
            backgroundColor: "#0ea5e9",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 66,
            left: 66,
            width: 78,
            height: 78,
            borderRadius: 20,
            backgroundColor: "#6366f1",
            border: "6px solid #0c0c0e",
            display: "flex",
          }}
        />
      </div>
    ),
    size,
  );
}
