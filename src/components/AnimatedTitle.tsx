import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONTS } from "../theme";
import { useDirection } from "./ThemeContext";

type Props = {
  text: string;
  /** Frame (relative to the scene) at which the first word appears. */
  delay?: number;
  /** Frames between each word. */
  stagger?: number;
  fontSize: number;
  color: string;
  fontWeight?: number;
  fontFamily?: string;
  lineHeight?: number;
  maxWidth?: number;
  /** Words (case-insensitive) rendered in the accent color. */
  highlight?: string[];
  highlightColor?: string;
  style?: React.CSSProperties;
};

// Title revealed word by word with a spring "rise and unblur" motion.
export const AnimatedTitle: React.FC<Props> = ({
  text,
  delay = 0,
  stagger = 3,
  fontSize,
  color,
  fontWeight = 800,
  fontFamily = FONTS.title,
  lineHeight,
  maxWidth = 900,
  highlight = [],
  highlightColor,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");
  const rtl = useDirection() === "rtl";
  const highlighted = highlight.map((w) => w.toLowerCase());

  return (
    <div
      style={{
        maxWidth,
        // Balanced lines: no orphan word on the last line.
        textWrap: "balance",
        fontFamily,
        fontSize,
        fontWeight,
        // Arabic letters are taller and must never be letter-spaced.
        lineHeight: lineHeight ?? (rtl ? 1.35 : 1.1),
        textAlign: "center",
        letterSpacing: rtl ? 0 : -0.5,
        ...style,
      }}
    >
      {words.map((word, i) => {
        const s = spring({
          frame: frame - delay - i * stagger,
          fps,
          config: { damping: 16, mass: 0.7, stiffness: 140 },
        });
        const isHighlighted = highlighted.includes(word.toLowerCase());
        return (
          <React.Fragment key={i}>
            {i > 0 ? " " : null}
            <span
              style={{
                display: "inline-block",
                color: isHighlighted && highlightColor ? highlightColor : color,
                opacity: interpolate(s, [0, 0.6], [0, 1], {
                  extrapolateRight: "clamp",
                }),
                transform: `translateY(${interpolate(s, [0, 1], [fontSize * 0.6, 0])}px)`,
                filter: `blur(${interpolate(s, [0, 1], [8, 0])}px)`,
              }}
            >
              {word}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
};
