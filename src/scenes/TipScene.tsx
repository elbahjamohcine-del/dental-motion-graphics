import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { AnimatedTitle } from "../components/AnimatedTitle";
import { Background } from "../components/Background";
import { IconBadge } from "../components/IconBadge";
import { InfoCard } from "../components/InfoCard";
import { Pill } from "../components/Pill";
import { TipImage } from "../components/TipImage";
import { useColors } from "../components/ThemeContext";
import type { TipContent } from "../schema";
import { tipTiming } from "../sceneTiming";
import { FONTS } from "../theme";

type Props = {
  content: TipContent;
  /** Position in the list (0-based), used for the big background number. */
  index: number;
  /** "mistake" = red ✕ badge, "option" = turquoise ✓ badge. */
  variant: "mistake" | "option";
};

// Reusable scene for one tip / mistake. Used once per entry in `tips`.
export const TipScene: React.FC<Props> = ({ content, index, variant }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const c = useColors();

  // Timings scale with the scene duration, so longer scenes stay balanced.
  const t = tipTiming(durationInFrames);
  const explanationIn = interpolate(frame, [t.explanation, t.explanation + 16], [0, 1], {
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
          dotColor={variant === "mistake" ? c.alert : c.turquoise}
          delay={t.label}
        />
        {/* Images sit a bit lower so they clear the corner portrait. */}
        <div style={{ marginTop: content.image ? 58 : 18 }}>
          {content.image ? (
            <TipImage
              src={content.image}
              width={800}
              delay={t.icon}
              stamp={variant === "mistake" ? "error" : "check"}
              stampDelay={t.stamp - t.icon}
            />
          ) : (
            <IconBadge
              icon={content.icon}
              size={370}
              delay={t.icon}
              stamp={variant === "mistake" ? "error" : "check"}
              stampDelay={t.stamp - t.icon}
            />
          )}
        </div>
        <AnimatedTitle
          text={content.title}
          delay={t.title}
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
          delay={t.card}
          fontSize={38}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
