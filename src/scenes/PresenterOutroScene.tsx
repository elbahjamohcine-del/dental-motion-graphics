import React from "react";
import {
  AbsoluteFill,
  Freeze,
  Img,
  interpolate,
  OffthreadVideo,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AnimatedTitle } from "../components/AnimatedTitle";
import { Background } from "../components/Background";
import { SpeakingBars } from "../components/SpeakingBars";
import { useColors } from "../components/ThemeContext";
import { AnimatedIcon } from "../icons/AnimatedIcon";
import type { OutroContent, Presenter } from "../schema";
import type { presenterOutroTiming } from "../sceneTiming";
import { FONTS } from "../theme";

const MEDIA_HEIGHT = 1240;

type Props = {
  content: OutroContent;
  presenter: Presenter;
  handle: string;
  brandName: string;
  timing: ReturnType<typeof presenterOutroTiming>;
  /** Frames (relative to the scene) where the voice-over is speaking. */
  speakingRanges: [number, number][];
  /** Same speed as the voice-over, so the lips stay in sync. */
  playbackRate: number;
};

// Outro where the presenter explains: the full portrait (or a lip-synced
// video of it) fills the top, the checklist then the call to action below.
export const PresenterOutroScene: React.FC<Props> = ({
  content,
  presenter,
  handle,
  brandName,
  timing: t,
  speakingRanges,
  playbackRate,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const c = useColors();

  const speaking = speakingRanges.some(([from, to]) => frame >= from && frame < to);
  const zoom = interpolate(frame, [0, durationInFrames], [1.04, 1.12]);
  const partOneOut = interpolate(frame, [t.secondPart, t.secondPart + 8], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const warningIn = spring({ frame: frame - t.warning, fps, config: { damping: 200 } });
  const ctaIn = spring({ frame: frame - t.cta, fps, config: { damping: 11 } });
  const pulse = 1 + Math.max(0, Math.sin((frame - t.cta) / 7)) * 0.03;
  const footerIn = interpolate(frame, [t.footer, t.footer + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const chipIn = spring({ frame: frame - 6, fps, config: { damping: 15 } });

  // Talking video: one segment per outro line, each starting at the moment
  // of the video where that line is said, so the lips match the voice even
  // if the pauses between lines differ. Without cuts, one continuous segment.
  const cuts = presenter.talkingVideoCuts;
  const starts = speakingRanges.map(([from]) => from);
  const videoSegments =
    cuts.length > 0 && cuts.length === starts.length
      ? starts.map((from, i) => ({
          from,
          duration: (starts[i + 1] ?? durationInFrames) - from,
          trimBefore: Math.round(cuts[i] * fps),
        }))
      : [{ from: t.talkStart, duration: durationInFrames - t.talkStart, trimBefore: 0 }];

  const mediaStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "50% 0%",
  };

  return (
    <AbsoluteFill>
      <Background variant="dark" />

      {/* Presenter: still portrait, replaced by the talking video when it starts. */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: MEDIA_HEIGHT,
          overflow: "hidden",
        }}
      >
        <div style={{ ...mediaStyle, transform: `scale(${zoom})`, transformOrigin: "50% 30%" }}>
          <Img src={staticFile(presenter.fullImage)} style={mediaStyle} />
          {presenter.talkingVideo && videoSegments[0].from > 0 ? (
            // Before the first line: the video's first frame (same framing
            // as the video, so there is no jump when it starts).
            <Sequence durationInFrames={videoSegments[0].from} layout="none">
              <Freeze frame={0}>
                <OffthreadVideo
                  src={staticFile(presenter.talkingVideo)}
                  muted
                  style={{ ...mediaStyle, position: "absolute", inset: 0 }}
                />
              </Freeze>
            </Sequence>
          ) : null}
          {presenter.talkingVideo
            ? videoSegments.map((segment, i) => (
                <Sequence
                  key={i}
                  from={segment.from}
                  durationInFrames={segment.duration}
                  layout="none"
                >
                  <OffthreadVideo
                    src={staticFile(presenter.talkingVideo)}
                    muted
                    trimBefore={segment.trimBefore}
                    playbackRate={playbackRate}
                    style={{ ...mediaStyle, position: "absolute", inset: 0 }}
                  />
                </Sequence>
              ))
            : null}
        </div>
        {/* Fades: darker top for the progress bar, navy at the bottom for the text. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(180deg, rgba(6,22,48,0.55) 0%, rgba(6,22,48,0) 16%, rgba(6,22,48,0) 52%, ${c.navyDeep} 96%)`,
          }}
        />
      </div>

      {/* "Speaking" chip with the presenter's name. */}
      <div
        style={{
          position: "absolute",
          top: 830,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: chipIn * partOneOut,
          transform: `translateY(${interpolate(chipIn, [0, 1], [20, 0])}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: "12px 26px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.95)",
            boxShadow: "0 14px 34px rgba(0,0,0,0.3)",
          }}
        >
          <SpeakingBars speaking={speaking} color={c.turquoise} height={30} />
          <div
            dir="auto"
            style={{ fontFamily: FONTS.title, fontWeight: 800, fontSize: 32, color: c.navy }}
          >
            {presenter.name}
          </div>
        </div>
      </div>

      {/* Part 1: title + checklist. */}
      <div
        style={{
          position: "absolute",
          top: 950,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          opacity: partOneOut,
          transform: `translateY(${(1 - partOneOut) * -24}px)`,
        }}
      >
        <AnimatedTitle text={content.title} delay={t.title} fontSize={66} color={c.white} />
        {content.checklist.map((item, i) => {
          const s = spring({
            frame: frame - t.listStart - i * t.listStagger,
            fps,
            config: { damping: 15, stiffness: 120 },
          });
          return (
            <div
              key={i}
              style={{
                width: 900,
                display: "flex",
                alignItems: "center",
                gap: 20,
                padding: "12px 22px",
                borderRadius: 24,
                background: "rgba(255,255,255,0.08)",
                border: "2px solid rgba(255,255,255,0.12)",
                borderInlineStart: `8px solid ${c.turquoise}`,
                opacity: s,
                transform: `translateX(${interpolate(s, [0, 1], [-160, 0])}px)`,
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: 58,
                  height: 58,
                  borderRadius: "50%",
                  background: c.turquoise,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AnimatedIcon name={item.icon} size={36} color={c.white} strokeWidth={16} />
              </div>
              <div style={{ fontFamily: FONTS.body, fontWeight: 600, fontSize: 32, color: c.white }}>
                {item.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Part 2: warning + call to action + disclaimer. */}
      <div
        style={{
          position: "absolute",
          top: 950,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 22,
        }}
      >
        <div
          style={{
            width: 900,
            display: "flex",
            alignItems: "center",
            gap: 22,
            padding: "18px 28px",
            borderRadius: 26,
            border: `3px solid ${c.turquoiseLight}`,
            background: "rgba(6,22,48,0.85)",
            opacity: warningIn,
            transform: `scale(${interpolate(warningIn, [0, 1], [0.9, 1])})`,
          }}
        >
          <div style={{ flexShrink: 0 }}>
            <AnimatedIcon name="phone" size={70} color={c.turquoiseLight} progress={warningIn} strokeWidth={12} />
          </div>
          <div style={{ fontFamily: FONTS.body, fontWeight: 600, fontSize: 34, lineHeight: 1.3, color: c.white }}>
            {content.warning}
          </div>
        </div>
        <div
          style={{
            padding: "18px 46px",
            borderRadius: 999,
            background: `linear-gradient(90deg, ${c.turquoise}, ${c.turquoiseLight})`,
            boxShadow: "0 20px 50px rgba(20,184,166,0.45)",
            textAlign: "center",
            transform: `scale(${ctaIn * pulse})`,
          }}
        >
          <div style={{ fontFamily: FONTS.title, fontWeight: 800, fontSize: 40, color: c.navyDeep }}>
            {content.cta}
          </div>
          <div style={{ fontFamily: FONTS.body, fontWeight: 600, fontSize: 32, color: c.navy }}>
            {/* Handles are Latin: keep "@" at the start even in RTL. */}
            <span dir="ltr">{handle}</span>
          </div>
        </div>
        <div style={{ opacity: footerIn, textAlign: "center", fontFamily: FONTS.body, color: c.white }}>
          <div dir="auto" style={{ fontWeight: 600, fontSize: 28, color: c.turquoiseLight }}>
            {brandName}
          </div>
          <div style={{ fontWeight: 400, fontSize: 24, opacity: 0.65, marginTop: 4 }}>
            {content.disclaimer}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
