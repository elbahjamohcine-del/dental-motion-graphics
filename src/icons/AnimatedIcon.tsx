import { evolvePath } from "@remotion/paths";
import React from "react";
import { interpolate } from "remotion";
import type { IconName } from "../schema";
import { iconPaths } from "./paths";

type Props = {
  name: IconName;
  size: number;
  color: string;
  /** 0 → nothing drawn, 1 → fully drawn. */
  progress?: number;
  strokeWidth?: number;
};

// Line icon that "draws itself" as `progress` goes from 0 to 1.
export const AnimatedIcon: React.FC<Props> = ({
  name,
  size,
  color,
  progress = 1,
  strokeWidth = 9,
}) => {
  const paths = iconPaths[name];
  const step = 1 / paths.length;

  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      {paths.map((d, i) => {
        // Paths overlap slightly in time for a fluid drawing motion.
        const local = interpolate(
          progress,
          [i * step * 0.8, Math.min(1, (i + 1) * step * 1.1)],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        const { strokeDasharray, strokeDashoffset } = evolvePath(local, d);
        return (
          <path
            key={i}
            d={d}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            opacity={local > 0 ? 1 : 0}
          />
        );
      })}
    </svg>
  );
};
