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
import { Pill } from "../components/Pill";
import { PresenterBadge } from "../components/PresenterBadge";
import { ProgressBar } from "../components/ProgressBar";
import { buildCues, Subtitles } from "../components/Subtitles";
import { ThemeProvider, useColors } from "../components/ThemeContext";
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
      {scene.chip ? (
        <div style={{ position: "absolute", top: 205, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <Pill text={scene.chip} color={c.white} background={c.navy} dotColor={c.turquoise} delay={4} fontSize={36} />
        </div>
      ) : null}
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
        <AnimatedTitle text={story.endCard.title} delay={16} fontSize={78} color={c.white} maxWidth={940} />
        <div
          style={{
            fontFamily: FONTS.title,
            fontWeight: 600,
            fontSize: 50,
            fontStyle: "italic",
            color: c.turquoiseLight,
            opacity: taglineIn,
            transform: `translateY(${(1 - taglineIn) * 20}px)`,
          }}
        >
          {story.endCard.tagline}
        </div>
        <div
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
    const list: { from: number; sound: string; volume: number }[] = [];
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

  // Corner portrait during the image scenes.
  const imageScenes = timeline.filter((_, i) => story.scenes[i].kind === "image");
  const cornerFrom = imageScenes.length ? imageScenes[0].from + Math.floor(T / 2) : 0;
  const lastImage = imageScenes.at(-1);
  const cornerTo = lastImage ? lastImage.from + lastImage.durationInFrames - Math.floor(T / 2) : 0;

  const transitionFor = (from: StoryScene, to: StoryScene): AnyPresentation => {
    if (to.kind === "end") return iris({ width: W, height: H });
    if (from.kind === "intro") return slide({ direction: "from-bottom" });
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
        {story.presenter.showInScenes && cornerTo > cornerFrom ? (
          <Sequence from={cornerFrom} durationInFrames={cornerTo - cornerFrom} layout="none">
            <CornerPresenter presenter={story.presenter} voiceClips={voiceClips} offset={cornerFrom} />
          </Sequence>
        ) : null}
        <ProgressBar timeline={timeline} totalDuration={total} />
        {story.showSubtitles ? <Subtitles cues={cues} /> : null}
        {story.music.src ? (
          <Html5Audio
            src={staticFile(story.music.src)}
            loop
            volume={(f) => musicVolumeAt(f, total, story.music, voiceClips)}
          />
        ) : null}
        {sfx.map((cue, i) => (
          <Sequence key={`sfx-${i}`} from={cue.from} durationInFrames={40} layout="none">
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
