import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import type { TimelineEntry } from "../timeline";
import { useColors } from "./ThemeContext";

// Story-style segmented progress bar (one segment per scene).
export const ProgressBar: React.FC<{
  timeline: TimelineEntry[];
  totalDuration: number;
}> = ({ timeline, totalDuration }) => {
  const frame = useCurrentFrame();
  const c = useColors();

  return (
    <div
      style={{
        position: "absolute",
        top: 70,
        left: 60,
        right: 60,
        display: "flex",
        gap: 10,
      }}
    >
      {timeline.map((scene, i) => {
        const end = timeline[i + 1]?.from ?? totalDuration;
        const progress = interpolate(frame, [scene.from, end], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={i}
            style={{
              flex: end - scene.from,
              height: 8,
              borderRadius: 4,
              background: "rgba(127, 140, 160, 0.3)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress * 100}%`,
                height: "100%",
                background: c.turquoise,
                borderRadius: 4,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
