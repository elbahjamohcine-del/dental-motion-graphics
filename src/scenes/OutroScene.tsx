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
import { InfoCard } from "../components/InfoCard";
import { PresenterBadge } from "../components/PresenterBadge";
import { useColors } from "../components/ThemeContext";
import { AnimatedIcon } from "../icons/AnimatedIcon";
import type { OutroContent, Presenter } from "../schema";
import { FONTS } from "../theme";

// Recap checklist, warning, call to action and medical disclaimer.
export const OutroScene: React.FC<{
  content: OutroContent;
  presenter: Presenter;
  handle: string;
  brandName: string;
}> = ({ content, presenter, handle, brandName }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = useColors();
  const hasPhoto = presenter.photo.trim().length > 0;

  const listStart = 14;
  const listStagger = 10;
  const warningDelay = listStart + content.checklist.length * listStagger + 8;
  const ctaDelay = warningDelay + 22;

  const warningIn = spring({ frame: frame - warningDelay, fps, config: { damping: 200 } });
  const ctaIn = spring({ frame: frame - ctaDelay, fps, config: { damping: 11 } });
  const pulse = 1 + Math.max(0, Math.sin((frame - ctaDelay) / 7)) * 0.03;
  const footerIn = interpolate(frame, [ctaDelay + 10, ctaDelay + 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Background variant="dark" />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 220, gap: 22 }}>
        <AnimatedTitle text={content.title} fontSize={84} color={c.white} />
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {content.checklist.map((item, i) => (
            <InfoCard
              key={i}
              icon={item.icon}
              text={item.text}
              variant="dark"
              from="side"
              fontSize={36}
              delay={listStart + i * listStagger}
            />
          ))}
        </div>
        <div
          style={{
            width: 900,
            display: "flex",
            alignItems: "center",
            gap: 24,
            padding: "20px 32px",
            borderRadius: 28,
            border: `3px solid ${c.turquoiseLight}`,
            background: "rgba(158,235,226,0.08)",
            opacity: warningIn,
            transform: `scale(${interpolate(warningIn, [0, 1], [0.9, 1])})`,
          }}
        >
          <div style={{ flexShrink: 0 }}>
            <AnimatedIcon
              name="phone"
              size={78}
              color={c.turquoiseLight}
              progress={warningIn}
              strokeWidth={12}
            />
          </div>
          <div
            style={{
              fontFamily: FONTS.body,
              fontWeight: 600,
              fontSize: 36,
              lineHeight: 1.3,
              color: c.white,
            }}
          >
            {content.warning}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 26,
            paddingBlock: hasPhoto ? 14 : 20,
            paddingInlineStart: hasPhoto ? 14 : 50,
            paddingInlineEnd: hasPhoto ? 44 : 50,
            borderRadius: 999,
            background: `linear-gradient(90deg, ${c.turquoise}, ${c.turquoiseLight})`,
            boxShadow: "0 20px 50px rgba(20,184,166,0.45)",
            transform: `scale(${ctaIn * pulse})`,
          }}
        >
          {hasPhoto ? (
            <PresenterBadge presenter={presenter} size={116} delay={ctaDelay} />
          ) : null}
          <div style={{ textAlign: hasPhoto ? "start" : "center" }}>
            <div
              style={{
                fontFamily: FONTS.title,
                fontWeight: 800,
                fontSize: 42,
                color: c.navyDeep,
              }}
            >
              {content.cta}
            </div>
            <div
              style={{
                fontFamily: FONTS.body,
                fontWeight: 600,
                fontSize: 34,
                color: c.navy,
                marginTop: 4,
              }}
            >
              {/* Handles are Latin: keep "@" at the start even in RTL. */}
              <span dir="ltr">{handle}</span>
            </div>
          </div>
        </div>
        <div
          style={{
            opacity: footerIn,
            textAlign: "center",
            fontFamily: FONTS.body,
            color: c.white,
          }}
        >
          <div style={{ fontWeight: 600, fontSize: 32, color: c.turquoiseLight }}>
            {brandName}
          </div>
          <div style={{ fontWeight: 400, fontSize: 26, opacity: 0.65, marginTop: 6 }}>
            {content.disclaimer}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
