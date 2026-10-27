import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useColors } from "./ThemeContext";

type Props = {
  variant: "light" | "dark";
};

// Soft medical background: gradient, slowly drifting turquoise glows and a
// subtle dot grid.
export const Background: React.FC<Props> = ({ variant }) => {
  const frame = useCurrentFrame();
  const c = useColors();
  const dark = variant === "dark";

  const drift = (speed: number, amplitude: number, phase = 0) =>
    Math.sin(frame / speed + phase) * amplitude;

  const base = dark
    ? `linear-gradient(165deg, ${c.navy} 0%, ${c.navyDeep} 100%)`
    : `linear-gradient(170deg, ${c.white} 0%, ${c.surface} 100%)`;

  const glowOpacity = dark ? 0.35 : 0.22;
  const dotColor = dark ? "rgba(255,255,255,0.07)" : "rgba(11,37,69,0.06)";
  const ringRotation = interpolate(frame, [0, 900], [0, 90]);

  return (
    <AbsoluteFill style={{ background: base, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${dotColor} 3px, transparent 3px)`,
          backgroundSize: "54px 54px",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          left: -380 + drift(70, 40),
          top: -260 + drift(90, 50, 1),
          background: `radial-gradient(circle, ${c.turquoise} 0%, transparent 65%)`,
          opacity: glowOpacity,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1000,
          height: 1000,
          borderRadius: "50%",
          right: -460 + drift(80, 50, 2),
          bottom: -300 + drift(60, 40, 3),
          background: `radial-gradient(circle, ${c.turquoise} 0%, transparent 65%)`,
          opacity: glowOpacity * 0.8,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1300,
          height: 1300,
          left: -110,
          top: 310,
          borderRadius: "50%",
          border: `2px dashed ${dark ? "rgba(255,255,255,0.08)" : "rgba(20,184,166,0.15)"}`,
          transform: `rotate(${ringRotation}deg)`,
        }}
      />
    </AbsoluteFill>
  );
};
