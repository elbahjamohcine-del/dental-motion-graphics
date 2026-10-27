import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AnimatedTitle } from "../components/AnimatedTitle";
import { Background } from "../components/Background";
import { IconBadge } from "../components/IconBadge";
import { Pill } from "../components/Pill";
import { useColors } from "../components/ThemeContext";
import type { IntroContent } from "../schema";
import { FONTS } from "../theme";

// Hook scene: kicker, icon, big number and the video title.
export const IntroScene: React.FC<{ content: IntroContent }> = ({ content }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = useColors();

  const numberIn = spring({
    frame: frame - 18,
    fps,
    config: { damping: 10, stiffness: 120, mass: 0.9 },
  });
  const underline = spring({ frame: frame - 48, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill>
      <Background variant="dark" />
      <AbsoluteFill
        style={{
          alignItems: "center",
          paddingTop: 240,
          gap: 30,
        }}
      >
        <Pill
          text={content.kicker}
          color={c.turquoiseLight}
          background="rgba(20,184,166,0.12)"
          border={`2px solid ${c.turquoise}`}
          dotColor={c.turquoise}
        />
        <IconBadge icon={content.icon} size={270} delay={4} variant="dark" />
        <div
          style={{
            fontFamily: FONTS.title,
            fontWeight: 800,
            fontSize: 270,
            lineHeight: 0.85,
            marginTop: 10,
            background: `linear-gradient(180deg, ${c.turquoiseLight} 0%, ${c.turquoise} 100%)`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            transform: `scale(${numberIn}) rotate(${interpolate(numberIn, [0, 1], [-12, 0])}deg)`,
            filter: "drop-shadow(0 20px 40px rgba(20,184,166,0.35))",
          }}
        >
          {content.bigNumber}
        </div>
        <AnimatedTitle
          text={content.title}
          delay={28}
          fontSize={96}
          color={c.white}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
            marginTop: -10,
          }}
        >
          <AnimatedTitle
            text={content.subtitle}
            delay={40}
            stagger={2}
            fontSize={54}
            fontWeight={600}
            color={c.turquoiseLight}
          />
          <div
            style={{
              height: 8,
              width: 360 * underline,
              borderRadius: 4,
              background: c.turquoise,
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
