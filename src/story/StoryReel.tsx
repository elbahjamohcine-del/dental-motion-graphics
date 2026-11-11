import { linearTiming, TransitionSeries, type TransitionPresentation } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { iris } from "@remotion/transitions/iris";
import { slide } from "@remotion/transitions/slide";
import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Html5Audio,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import "../fonts";
import { AnimatedTitle } from "../components/AnimatedTitle";
import { Background } from "../components/Background";
import { CornerPresenter } from "../components/CornerPresenter";
import { IconBadge } from "../components/IconBadge";
import { Pill } from "../components/Pill";
import { PresenterBadge } from "../components/PresenterBadge";
import { ProgressBar } from "../components/ProgressBar";
import { buildCues, Subtitles } from "../components/Subtitles";
import { DirectionOverride, ThemeProvider, useColors } from "../components/ThemeContext";
import { musicVolumeAt } from "../music";
import { FONTS, VIDEO } from "../theme";
import type { StoryContent, StoryScene } from "./schema";
import { storyDuration, storyTimeline } from "./voice";

const W = VIDEO.width;
const H = VIDEO.height;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyPresentation = TransitionPresentation<any>;

// Position on screen of a point of the image (in %), once the camera has
// zoomed by `scale` towards the focus point (fx, fy).
const project = (x: number, y: number, fx: number, fy: number, scale: number) => ({
  left: (fx + (x - fx) * scale) * (W / 100),
  top: (fy + (y - fy) * scale) * (H / 100),
});

const Label: React.FC<{
  label: StoryScene["labels"][number];
  camera: { fx: number; fy: number; scale: number };
}> = ({ label, camera }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = useColors();
  const start = Math.round(label.at * fps);
  const dotIn = spring({ frame: frame - start, fps, config: { damping: 12 } });
  const lineIn = interpolate(frame - start, [6, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pillIn = spring({ frame: frame - start - 12, fps, config: { damping: 14 } });
  const { left, top } = project(label.x, label.y, camera.fx, camera.fy, camera.scale);

  const pillWidth = 300;
  const margin = 48;
  const pillInner = label.side === "right" ? W - margin - pillWidth : margin + pillWidth;
  const lineFrom = Math.min(left, pillInner);
  const lineLength = Math.abs(pillInner - left);
  const pulse = 1 + Math.sin(frame / 6) * 0.15;

  return (
    <>
      {/* Line from the point to the label. */}
      <div
        style={{
          position: "absolute",
          top: top - 2,
          left: lineFrom,
          width: lineLength,
          height: 4,
          borderRadius: 2,
          background: c.navy,
          opacity: 0.85,
          transformOrigin: label.side === "right" ? "left center" : "right center",
          transform: `scaleX(${lineIn})`,
        }}
      />
      {/* Point on the anatomy. */}
      <div
        style={{
          position: "absolute",
          left: left - 14,
          top: top - 14,
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: c.white,
          border: `7px solid ${c.turquoise}`,
          boxShadow: `0 0 0 ${8 * pulse}px ${c.turquoise}40`,
          transform: `scale(${dotIn})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: top - 34,
          left: label.side === "right" ? W - margin - pillWidth : margin,
          width: pillWidth,
          height: 68,
          borderRadius: 34,
          background: c.white,
          border: `3px solid ${c.turquoise}`,
          boxShadow: "0 12px 30px rgba(11,37,69,0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONTS.title,
          fontWeight: 800,
          fontSize: 34,
          color: c.navy,
          opacity: pillIn,
          transform: `translateY(${interpolate(pillIn, [0, 1], [16, 0])}px)`,
        }}
      >
        {label.text}
      </div>
    </>
  );
};

// Full-screen anatomical image(s) with a slow camera move and labels.
const ImageScene: React.FC<{ scene: StoryScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const c = useColors();
  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateRight: "clamp",
  });
  // Ease the camera: slow start, slow end.
  const eased = 0.5 - Math.cos(progress * Math.PI) / 2;
  const camera = {
    fx: interpolate(eased, [0, 1], [scene.camera.from.x, scene.camera.to.x]),
    fy: interpolate(eased, [0, 1], [scene.camera.from.y, scene.camera.to.y]),
    scale: interpolate(eased, [0, 1], [scene.camera.from.scale, scene.camera.to.scale]),
  };

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${c.white}, ${c.surface})` }}>
      <AbsoluteFill
        style={{
          transformOrigin: `${camera.fx}% ${camera.fy}%`,
          transform: `scale(${camera.scale})`,
        }}
      >
        {scene.images.map((image, i) => {
          const at = Math.round(image.at * fps);
          const opacity =
            i === 0 ? 1 : interpolate(frame, [at, at + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <Img
              key={image.src}
              src={staticFile(image.src)}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity }}
            />
          );
        })}
      </AbsoluteFill>
      {scene.labels.map((label, i) => (
        <Label key={i} label={label} camera={camera} />
      ))}
      {scene.sound ? <ShockFlash at={Math.round(scene.sound.at * fps)} /> : null}
      {scene.headline ? <Headline headline={scene.headline} /> : null}
      {scene.chip ? (
        <div style={{ position: "absolute", top: 205, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <Pill text={scene.chip} color={c.white} background={c.navy} dotColor={c.turquoise} delay={4} fontSize={36} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// Red vignette pulsing with the hook's stinger (a hit, then a heartbeat).
const ShockFlash: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame() - at;
  const pulse = (start: number, peak: number) =>
    interpolate(frame, [start, start + 3, start + 22], [0, peak, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  const strength = Math.max(pulse(0, 0.85), pulse(50, 0.45));
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        opacity: strength,
        background: "radial-gradient(ellipse at center, rgba(180,0,0,0) 35%, rgba(150,0,0,0.85) 100%)",
      }}
    />
  );
};

// Big headline popping in at the top of the image (hook).
const Headline: React.FC<{ headline: NonNullable<StoryScene["headline"]> }> = ({ headline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = useColors();
  const pop = spring({ frame: frame - Math.round(headline.at * fps), fps, config: { damping: 10, stiffness: 160 } });
  const { text, highlight } = headline;
  const out =
    headline.until === undefined
      ? 1
      : interpolate(frame, [headline.until * fps - 8, headline.until * fps], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
  const cut = highlight ? text.indexOf(highlight) : -1;
  return (
    <div style={{ position: "absolute", top: 230, left: 60, right: 60, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          padding: "26px 44px",
          borderRadius: 40,
          background: c.navy,
          boxShadow: "0 24px 60px rgba(11,37,69,0.35)",
          fontFamily: FONTS.title,
          fontWeight: 800,
          fontSize: 64,
          lineHeight: 1.3,
          color: c.white,
          textAlign: "center",
          opacity: Math.min(1, pop * 1.5) * out,
          transform: `scale(${interpolate(pop, [0, 1], [0.6, 1])})`,
        }}
      >
        {cut < 0 ? (
          text
        ) : (
          <>
            {text.slice(0, cut)}
            <span style={{ color: c.turquoiseLight }}>{highlight}</span>
            {text.slice(cut + highlight!.length)}
          </>
        )}
      </div>
    </div>
  );
};

// The presenter full screen, speaking (placeholder: the full portrait with a
// slow push-in; the presenter's own video takes its place once recorded).
const TalkScene: React.FC<{ story: StoryContent; scene: StoryScene }> = ({ story, scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const c = useColors();
  const zoom = interpolate(frame, [0, durationInFrames], [1.04, 1.14]);
  const tagIn = spring({ frame: frame - 10, fps, config: { damping: 14 } });
  return (
    <AbsoluteFill style={{ backgroundColor: c.navyDeep }}>
      <Img
        src={staticFile(story.presenter.fullImage)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "50% 20%",
          transform: `scale(${zoom})`,
          transformOrigin: "50% 30%",
        }}
      />
      {/* Darker bottom so the subtitles stay readable. */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(6,22,43,0) 55%, rgba(6,22,43,0.55) 100%)" }} />
      {scene.headline ? <Headline headline={scene.headline} /> : null}
      {/* Name tag (lower third), above the subtitles. */}
      <div style={{ position: "absolute", top: 1150, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: "14px 30px",
            borderRadius: 999,
            background: c.navy,
            boxShadow: "0 14px 34px rgba(0,0,0,0.3)",
            opacity: tagIn,
            transform: `translateY(${(1 - tagIn) * 24}px)`,
          }}
        >
          <div style={{ width: 16, height: 16, borderRadius: "50%", background: c.turquoise }} />
          <DirectionOverride direction="ltr">
            <div style={{ fontFamily: FONTS.title, fontWeight: 800, fontSize: 32, color: c.white }}>
              {story.presenter.name}
            </div>
          </DirectionOverride>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Numbered steps with self-drawing icons, each one appearing with its line.
const StepsScene: React.FC<{ scene: StoryScene; lineStarts: (number | undefined)[] }> = ({ scene, lineStarts }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = useColors();
  const steps = scene.steps ?? [];
  return (
    <AbsoluteFill>
      <Background variant="light" />
      {scene.chip ? (
        <div style={{ position: "absolute", top: 205, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <Pill text={scene.chip} color={c.white} background={c.navy} dotColor={c.turquoise} delay={4} fontSize={36} />
        </div>
      ) : null}
      <AbsoluteFill style={{ paddingTop: 380, paddingInline: 70, gap: 44, display: "flex", flexDirection: "column" }}>
        {steps.map((step, i) => {
          const start = lineStarts[step.line] ?? Math.round(step.at * fps);
          const enter = spring({ frame: frame - start, fps, config: { damping: 13 } });
          const active =
            frame >= start && (i === steps.length - 1 || frame < (lineStarts[steps[i + 1].line] ?? Math.round(steps[i + 1].at * fps)));
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 34,
                padding: "26px 34px",
                borderRadius: 36,
                background: c.white,
                border: `4px solid ${active ? c.turquoise : "transparent"}`,
                boxShadow: active ? "0 22px 50px rgba(20,184,166,0.28)" : "0 14px 34px rgba(11,37,69,0.12)",
                opacity: enter,
                transform: `translateX(${interpolate(enter, [0, 1], [80, 0])}px) scale(${active ? 1.03 : 1})`,
              }}
            >
              <IconBadge icon={step.icon} size={170} delay={start} />
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ fontFamily: FONTS.title, fontWeight: 800, fontSize: 40, color: c.turquoise }}>
                  {i + 1}
                </div>
                <div style={{ fontFamily: FONTS.title, fontWeight: 800, fontSize: 52, color: c.navy, lineHeight: 1.25 }}>
                  {step.text}
                </div>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Hook: the presenter's portrait and the title.
export const IntroScene: React.FC<{ story: StoryContent }> = ({ story }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = useColors();
  const cardIn = spring({ frame: frame - 4, fps, config: { damping: 14 } });
  const zoom = interpolate(frame, [0, 150], [1.02, 1.1]);
  return (
    <AbsoluteFill>
      <Background variant="light" />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 215, gap: 34 }}>
        <Pill text={story.kicker} color={c.white} background={c.navy} dotColor={c.turquoise} fontSize={34} />
        <div
          style={{
            width: 700,
            height: 720,
            borderRadius: 48,
            overflow: "hidden",
            border: `8px solid ${c.turquoise}`,
            boxShadow: "0 30px 70px rgba(11,37,69,0.25)",
            opacity: cardIn,
            transform: `translateY(${interpolate(cardIn, [0, 1], [60, 0])}px) scale(${interpolate(cardIn, [0, 1], [0.9, 1])})`,
          }}
        >
          <Img
            src={staticFile(story.presenter.fullImage)}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 0%", transform: `scale(${zoom})`, transformOrigin: "50% 20%" }}
          />
        </div>
        <AnimatedTitle text={story.title} delay={16} fontSize={72} color={c.navy} maxWidth={900} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const isLatin = (text: string) => !/[\u0590-\u08FF]/.test(text); // no Hebrew/Arabic letters

// End card: clinic name, tagline, phone and handle.
const EndScene: React.FC<{ story: StoryContent }> = ({ story }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = useColors();
  const taglineIn = interpolate(frame, [34, 52], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const phoneIn = spring({ frame: frame - 50, fps, config: { damping: 11 } });
  return (
    <AbsoluteFill>
      <Background variant="dark" />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 300, gap: 36 }}>
        <PresenterBadge presenter={story.presenter} size={300} delay={2} />
        {/* A Latin name keeps its word order in a right-to-left video. */}
        <DirectionOverride direction={isLatin(story.endCard.title) ? "ltr" : story.direction}>
          <AnimatedTitle text={story.endCard.title} delay={16} fontSize={78} color={c.white} maxWidth={940} />
        </DirectionOverride>
        <div
          style={{
            fontFamily: FONTS.title,
            fontWeight: 600,
            fontSize: 50,
            fontStyle: story.direction === "ltr" ? "italic" : "normal",
            color: c.turquoiseLight,
            opacity: taglineIn,
            transform: `translateY(${(1 - taglineIn) * 20}px)`,
          }}
        >
          {story.endCard.tagline}
        </div>
        <div
          dir="ltr"
          style={{
            marginTop: 10,
            padding: "18px 46px",
            borderRadius: 999,
            background: `linear-gradient(90deg, ${c.turquoise}, ${c.turquoiseLight})`,
            boxShadow: "0 20px 50px rgba(20,184,166,0.45)",
            textAlign: "center",
            transform: `scale(${phoneIn})`,
          }}
        >
          <div style={{ fontFamily: FONTS.title, fontWeight: 800, fontSize: 46, color: c.navyDeep }}>
            {story.endCard.phone}
          </div>
          <div style={{ fontFamily: FONTS.body, fontWeight: 600, fontSize: 30, color: c.navy }}>
            {story.brand.handle}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Story reel engine: scenes, transitions, subtitles, voice, music, sounds.
export const StoryReel: React.FC<StoryContent> = (story) => {
  const T = story.transitionDurationInFrames;
  const timeline = useMemo(() => storyTimeline(story), [story]);
  const total = storyDuration(story);
  const voiceClips = useMemo(() => story.voiceClips ?? [], [story.voiceClips]);
  const cues = useMemo(() => buildCues(timeline, T, total, voiceClips), [timeline, T, total, voiceClips]);

  // Sounds: whoosh on scene changes, pop on each label, chime on the end card.
  const sfx = useMemo(() => {
    if (!story.sfx.enabled) return [];
    const list: { from: number; sound: string; volume: number; length?: number }[] = [];
    // Scene sounds (e.g. the hook's stinger) keep their own volume.
    story.scenes.forEach((scene, i) => {
      if (scene.sound) {
        list.push({
          from: timeline[i].from + Math.round(scene.sound.at * VIDEO.fps),
          sound: scene.sound.name,
          volume: scene.sound.volume / story.sfx.volume,
          length: 120,
        });
      }
    });
    timeline.slice(1).forEach((s) => list.push({ from: s.from, sound: "whoosh", volume: 0.7 }));
    story.scenes.forEach((scene, i) =>
      scene.labels.forEach((l) =>
        list.push({ from: timeline[i].from + Math.round(l.at * VIDEO.fps), sound: "pop", volume: 0.7 }),
      ),
    );
    const end = timeline.at(-1)!;
    list.push({ from: end.from + 50, sound: "success", volume: 0.85 });
    return list.map((s) => ({ ...s, volume: s.volume * story.sfx.volume }));
  }, [story, timeline]);

  // Corner portrait during each run of image / steps scenes (not over a headline).
  const withBubble = (scene: StoryScene) => (scene.kind === "image" || scene.kind === "steps") && !scene.headline;
  const cornerRuns = useMemo(() => {
    const runs: { from: number; to: number }[] = [];
    story.scenes.forEach((scene, i) => {
      const t = timeline[i];
      if (!withBubble(scene)) return;
      const from = t.from + Math.floor(T / 2);
      const to = t.from + t.durationInFrames - Math.floor(T / 2);
      const last = runs.at(-1);
      if (last && i > 0 && withBubble(story.scenes[i - 1])) last.to = to;
      else runs.push({ from, to });
    });
    return runs;
  }, [story.scenes, timeline, T]);

  const transitionFor = (from: StoryScene, to: StoryScene): AnyPresentation => {
    if (to.kind === "end") return iris({ width: W, height: H });
    if (from.kind === "intro") return slide({ direction: "from-bottom" });
    if (from.kind === "talk" || to.kind === "talk") return slide({ direction: "from-right" });
    return fade(); // same tooth, next stage: a smooth dissolve
  };

  return (
    <ThemeProvider colors={story.theme} direction={story.direction}>
      <AbsoluteFill style={{ backgroundColor: story.theme.white }}>
        <TransitionSeries>
          {story.scenes.map((scene, i) => {
            const elements = [
              <TransitionSeries.Sequence key={`s-${i}`} durationInFrames={scene.durationInFrames}>
                {scene.kind === "intro" ? (
                  <IntroScene story={story} />
                ) : scene.kind === "end" ? (
                  <EndScene story={story} />
                ) : scene.kind === "talk" ? (
                  <TalkScene story={story} scene={scene} />
                ) : scene.kind === "steps" ? (
                  <StepsScene
                    scene={scene}
                    lineStarts={scene.voice.map((_, j) => {
                      const clip = voiceClips.find((v) => v.sceneIndex === i && v.lineIndex === j);
                      return clip ? clip.from - timeline[i].from : undefined;
                    })}
                  />
                ) : (
                  <ImageScene scene={scene} />
                )}
              </TransitionSeries.Sequence>,
            ];
            if (i < story.scenes.length - 1 && T > 0) {
              elements.push(
                <TransitionSeries.Transition
                  key={`t-${i}`}
                  presentation={transitionFor(scene, story.scenes[i + 1])}
                  timing={linearTiming({ durationInFrames: T })}
                />,
              );
            }
            return elements;
          })}
        </TransitionSeries>
        {story.presenter.showInScenes
          ? cornerRuns.map((run) => (
              <Sequence key={run.from} from={run.from} durationInFrames={run.to - run.from} layout="none">
                <CornerPresenter presenter={story.presenter} voiceClips={voiceClips} offset={run.from} />
              </Sequence>
            ))
          : null}
        <ProgressBar timeline={timeline} totalDuration={total} />
        {story.showSubtitles ? <Subtitles cues={cues} /> : null}
        {story.music.src ? (
          <Sequence from={story.music.startFrame ?? 0} layout="none">
            <Html5Audio
              src={staticFile(story.music.src)}
              loop
              volume={(f) => musicVolumeAt(f + (story.music.startFrame ?? 0), total, story.music, voiceClips)}
            />
          </Sequence>
        ) : null}
        {sfx.map((cue, i) => (
          <Sequence key={`sfx-${i}`} from={cue.from} durationInFrames={cue.length ?? 40} layout="none">
            <Html5Audio src={staticFile(`sfx/${cue.sound}.mp3`)} volume={cue.volume} />
          </Sequence>
        ))}
        {voiceClips.map((clip) => (
          <Sequence key={`${clip.sceneIndex}-${clip.lineIndex}`} from={clip.from} durationInFrames={clip.durationInFrames} layout="none">
            <Html5Audio src={staticFile(clip.src)} volume={story.voiceover.volume} playbackRate={story.voiceover.playbackRate} />
          </Sequence>
        ))}
      </AbsoluteFill>
    </ThemeProvider>
  );
};

// Cover image: the intro once its animation has settled.
export const StoryCover: React.FC<StoryContent> = (story) => (
  <ThemeProvider colors={story.theme} direction={story.direction}>
    <Sequence from={-60}>
      <IntroScene story={story} />
    </Sequence>
  </ThemeProvider>
);
