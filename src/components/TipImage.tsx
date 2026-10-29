import React from "react";
import {
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { useColors } from "./ThemeContext";

type Props = {
  src: string;
  /** Card width; the height follows the 16:9 image ratio. */
  width: number;
  delay?: number;
  stamp: "error" | "check";
  stampDelay?: number;
};

// Realistic 16:9 image in a rounded card (used instead of an icon), with a slow
// zoom and the same ✕ / ✓ stamp as the icon badge.
export const TipImage: React.FC<Props> = ({ src, width, delay = 0, stamp, stampDelay = 30 }) => {
  const height = Math.round((width * 9) / 16);
  const size = height; // reference for radii, borders and the stamp
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const c = useColors();

  const enter = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 110 } });
  const stampIn = spring({
    frame: frame - delay - stampDelay,
    fps,
    config: { damping: 9, stiffness: 160 },
  });
  const zoom = interpolate(frame, [0, durationInFrames], [1.0, 1.1]);
  const stampSize = size * 0.22;

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        opacity: interpolate(enter, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }),
        transform: `translateY(${interpolate(enter, [0, 1], [40, 0])}px) scale(${interpolate(enter, [0, 1], [0.85, 1])})`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: size * 0.12,
          overflow: "hidden",
          border: `${size * 0.018}px solid ${c.turquoise}`,
          boxShadow: `0 ${size * 0.06}px ${size * 0.16}px rgba(11,37,69,0.22)`,
          background: c.white,
        }}
      >
        <Img
          src={staticFile(src)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${zoom})`,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          insetInlineEnd: -size * 0.05,
          top: -size * 0.05,
          width: stampSize,
          height: stampSize,
          borderRadius: "50%",
          background: stamp === "error" ? c.alert : c.turquoise,
          border: `${size * 0.016}px solid ${c.white}`,
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${stampIn}) rotate(${interpolate(stampIn, [0, 1], [-60, 0])}deg)`,
        }}
      >
        <svg width={stampSize * 0.5} height={stampSize * 0.5} viewBox="0 0 100 100">
          <path
            d={stamp === "error" ? "M25 25 L75 75 M75 25 L25 75" : "M22 52 L42 72 L80 30"}
            stroke={c.white}
            strokeWidth={14}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
};
