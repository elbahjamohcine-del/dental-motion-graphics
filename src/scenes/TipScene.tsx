import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { AnimatedTitle } from "../components/AnimatedTitle";
import { Background } from "../components/Background";
import { IconBadge } from "../components/IconBadge";
import { InfoCard } from "../components/InfoCard";
import { Pill } from "../components/Pill";
import { useColors } from "../components/ThemeContext";
import type { TipContent } from "../schema";
import { FONTS } from "../theme";

type Props = {
  content: TipContent;
  /** Position in the list (0-based), used for the big background number. */
  index: number;
};

// Reusable scene for one tip / mistake. Used once per entry in `tips`.
export const TipScene: React.FC<Props> = ({ content, index }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const c = useColors();

  // Timings scale with the scene duration, so longer scenes stay balanced.
  const cardDelay = Math.round(durationInFrames * 0.36);
  const explanationIn = interpolate(frame, [34, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const number = String(index + 1).padStart(2, "0");

  return (
    <AbsoluteFill>
      <Background variant="light" />
      {/* Giant outlined number in the background (slow parallax). */}
      <div
        style={{
          position: "absolute",
          insetInlineEnd: -40,
          top: 150 - frame * 0.25,
          fontFamily: FONTS.title,
          fontWeight: 800,
          fontSize: 520,
          lineHeight: 1,
          color: "transparent",
          WebkitTextStroke: `4px ${c.turquoise}`,
          opacity: 0.16,
        }}
      >
        {number}
      </div>
      <AbsoluteFill
        style={{
          alignItems: "center",
          paddingTop: 230,
          gap: 36,
        }}
      >
        <Pill
          text={content.label}
          color={c.white}
          background={c.navy}
          dotColor={c.alert}
          delay={2}
        />
        <div style={{ marginTop: 18 }}>
          <IconBadge
            icon={content.icon}
            size={370}
            delay={6}
            stamp="error"
            stampDelay={34}
          />
        </div>
        <AnimatedTitle
          text={content.title}
          delay={14}
          fontSize={84}
          color={c.navy}
          maxWidth={880}
          style={{ marginTop: 14 }}
        />
        <div
          style={{
            maxWidth: 820,
            textAlign: "center",
            fontFamily: FONTS.body,
            fontWeight: 500,
            fontSize: 38,
            lineHeight: 1.35,
            color: c.navy,
            opacity: explanationIn * 0.8,
            transform: `translateY(${(1 - explanationIn) * 20}px)`,
            marginTop: -6,
            textWrap: "balance",
          }}
        >
          {content.explanation}
        </div>
        <InfoCard
          icon="check"
          label={content.goodPracticeLabel}
          text={content.goodPractice}
          delay={cardDelay}
          fontSize={38}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
