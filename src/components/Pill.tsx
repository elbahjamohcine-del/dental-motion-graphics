import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONTS } from "../theme";
import { useDirection } from "./ThemeContext";

type Props = {
  text: string;
  delay?: number;
  color: string;
  background: string;
  border?: string;
  fontSize?: number;
  dotColor?: string;
};

// Small uppercase label ("CONSEIL DENTAIRE", "ERREUR N°1", ...).
export const Pill: React.FC<Props> = ({
  text,
  delay = 0,
  color,
  background,
  border,
  fontSize = 34,
  dotColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  // Letter-spacing would break the joined Arabic letters.
  const spacing = useDirection() === "rtl" ? 0 : fontSize * 0.14;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 16,
        padding: `${fontSize * 0.45}px ${fontSize * 1}px`,
        borderRadius: 999,
        background,
        border,
        color,
        fontFamily: FONTS.title,
        fontWeight: 700,
        fontSize,
        letterSpacing: spacing,
        textTransform: "uppercase",
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [-30, 0])}px)`,
        // Letter-spacing adds space after the last letter: compensate.
        paddingInlineEnd: fontSize - spacing,
      }}
    >
      {dotColor ? (
        <span
          style={{
            width: fontSize * 0.42,
            height: fontSize * 0.42,
            borderRadius: "50%",
            background: dotColor,
            boxShadow: `0 0 0 ${interpolate(Math.sin(frame / 6), [-1, 1], [0, 8])}px ${dotColor}33`,
          }}
        />
      ) : null}
      {text}
    </div>
  );
};
