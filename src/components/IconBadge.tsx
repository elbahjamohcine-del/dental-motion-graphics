import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AnimatedIcon } from "../icons/AnimatedIcon";
import type { IconName } from "../schema";
import { useColors } from "./ThemeContext";

type Props = {
  icon: IconName;
  size: number;
  delay?: number;
  variant?: "light" | "dark";
  /** Small round stamp popping on the top-right corner. */
  stamp?: "error" | "check";
  stampDelay?: number;
};

// Round badge with a rotating dashed ring and a self-drawing icon.
export const IconBadge: React.FC<Props> = ({
  icon,
  size,
  delay = 0,
  variant = "light",
  stamp,
  stampDelay = 30,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = useColors();

  const enter = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 110 },
  });
  const draw = interpolate(frame - delay - 6, [0, 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const stampIn = spring({
    frame: frame - delay - stampDelay,
    fps,
    config: { damping: 9, stiffness: 160 },
  });
  // Gentle floating once on screen.
  const float = Math.sin((frame - delay) / 18) * 6;

  const dark = variant === "dark";
  const fill = dark
    ? "rgba(255,255,255,0.06)"
    : `radial-gradient(circle at 35% 30%, ${c.white} 0%, ${c.surface} 100%)`;
  const iconColor = dark ? c.white : c.navy;
  const stampSize = size * 0.3;

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        transform: `translateY(${float}px) scale(${enter})`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -size * 0.07,
          borderRadius: "50%",
          border: `3px dashed ${c.turquoise}`,
          opacity: 0.6,
          transform: `rotate(${frame * 0.6}deg)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: fill,
          border: `${size * 0.025}px solid ${c.turquoise}`,
          boxShadow: dark
            ? `0 0 ${size * 0.25}px rgba(20,184,166,0.35)`
            : `0 ${size * 0.08}px ${size * 0.2}px rgba(11,37,69,0.15)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AnimatedIcon
          name={icon}
          size={size * 0.62}
          color={iconColor}
          progress={draw}
        />
      </div>
      {stamp ? (
        <div
          style={{
            position: "absolute",
            right: -size * 0.02,
            top: -size * 0.02,
            width: stampSize,
            height: stampSize,
            borderRadius: "50%",
            background: stamp === "error" ? c.alert : c.turquoise,
            border: `${size * 0.02}px solid ${c.white}`,
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${stampIn}) rotate(${interpolate(stampIn, [0, 1], [-60, 0])}deg)`,
          }}
        >
          <svg
            width={stampSize * 0.5}
            height={stampSize * 0.5}
            viewBox="0 0 100 100"
          >
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
      ) : null}
    </div>
  );
};
