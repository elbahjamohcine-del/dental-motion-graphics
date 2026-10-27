import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AnimatedIcon } from "../icons/AnimatedIcon";
import type { IconName } from "../schema";
import { FONTS } from "../theme";
import { useColors, useDirection } from "./ThemeContext";

type Props = {
  icon: IconName;
  label?: string;
  text: string;
  delay?: number;
  variant?: "light" | "dark";
  /** "side" slides in from the end of the line (left in RTL, right in LTR). */
  from?: "bottom" | "side";
  fontSize?: number;
  width?: number;
};

// Card with a round icon on the left. Used for "Le bon réflexe" and the
// outro checklist.
export const InfoCard: React.FC<Props> = ({
  icon,
  label,
  text,
  delay = 0,
  variant = "light",
  from = "bottom",
  fontSize = 40,
  width = 900,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = useColors();
  const rtl = useDirection() === "rtl";
  const s = spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 120 } });
  const draw = interpolate(frame - delay - 8, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dark = variant === "dark";
  const offset = interpolate(s, [0, 1], [from === "bottom" ? 50 : 260, 0]);
  const iconSize = fontSize * 2.3;

  return (
    <div
      style={{
        width,
        display: "flex",
        alignItems: "center",
        gap: 30,
        padding: "22px 34px",
        borderRadius: 32,
        background: dark ? "rgba(255,255,255,0.07)" : c.white,
        border: dark ? "2px solid rgba(255,255,255,0.12)" : `2px solid ${c.turquoise}40`,
        borderInlineStart: `10px solid ${c.turquoise}`,
        boxShadow: dark ? "none" : "0 22px 50px rgba(11,37,69,0.12)",
        opacity: interpolate(s, [0, 0.5], [0, 1], { extrapolateRight: "clamp" }),
        transform:
          from === "bottom"
            ? `translateY(${offset}px)`
            : `translateX(${rtl ? -offset : offset}px)`,
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: iconSize,
          height: iconSize,
          borderRadius: "50%",
          background: c.turquoise,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AnimatedIcon
          name={icon}
          size={iconSize * 0.62}
          color={c.white}
          progress={draw}
          strokeWidth={16}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {label ? (
          <div
            style={{
              fontFamily: FONTS.title,
              fontWeight: 700,
              fontSize: fontSize * 0.68,
              letterSpacing: rtl ? 0 : 3,
              textTransform: "uppercase",
              color: c.turquoise,
            }}
          >
            {label}
          </div>
        ) : null}
        <div
          style={{
            fontFamily: FONTS.body,
            fontWeight: 600,
            fontSize,
            lineHeight: 1.25,
            color: dark ? c.white : c.navy,
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
};
