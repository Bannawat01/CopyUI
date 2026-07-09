import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * CopyUI mark: two offset rounded cards (a "copy" motif) on the same
 * near-black surface as the Open Graph image — sky card behind, indigo
 * card in front. Kept to two shapes so it stays legible at 16px.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#0c0c0e",
          borderRadius: 7,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 6,
            left: 6,
            width: 15,
            height: 15,
            borderRadius: 4,
            backgroundColor: "#0ea5e9",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            width: 15,
            height: 15,
            borderRadius: 4,
            backgroundColor: "#6366f1",
            border: "2px solid #0c0c0e",
            display: "flex",
          }}
        />
      </div>
    ),
    size,
  );
}
