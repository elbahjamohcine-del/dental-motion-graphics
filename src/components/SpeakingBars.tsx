import React from "react";
import { useCurrentFrame } from "remotion";

// Little equalizer bars that move while the presenter is speaking.
export const SpeakingBars: React.FC<{
  speaking: boolean;
  color: string;
  height: number;
  bars?: number;
}> = ({ speaking, color, height, bars = 4 }) => {
  const frame = useCurrentFrame();
  const width = height * 0.16;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: width * 0.8, height }}>
      {Array.from({ length: bars }, (_, i) => {
        // Pseudo-random but smooth motion, different for each bar.
        const wave =
          0.5 +
          0.3 * Math.sin(frame / 2.3 + i * 1.7) +
          0.2 * Math.sin(frame / 1.3 + i * 2.9);
        const level = speaking ? 0.25 + 0.75 * Math.max(0, Math.min(1, wave)) : 0.2;
        return (
          <div
            key={i}
            style={{
              width,
              height: height * level,
              borderRadius: width,
              background: color,
            }}
          />
        );
      })}
    </div>
  );
};
