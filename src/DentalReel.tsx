import {
  linearTiming,
  springTiming,
  TransitionSeries,
  type TransitionPresentation,
} from "@remotion/transitions";
import { iris } from "@remotion/transitions/iris";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import React, { useMemo } from "react";
import { AbsoluteFill, Html5Audio, Sequence, staticFile } from "remotion";
import "./fonts";
import { CornerPresenter } from "./components/CornerPresenter";
import { ProgressBar } from "./components/ProgressBar";
import { buildCues, Subtitles } from "./components/Subtitles";
import { ThemeProvider } from "./components/ThemeContext";
import { IntroScene } from "./scenes/IntroScene";
import { OutroScene } from "./scenes/OutroScene";
import { PresenterOutroScene } from "./scenes/PresenterOutroScene";
import { TipScene } from "./scenes/TipScene";
import { presenterOutroTiming } from "./sceneTiming";
import type { VideoContent } from "./schema";
import { musicVolumeAt } from "./music";
import { buildSfxCues } from "./sfx";
import { VIDEO } from "./theme";
import { buildTimeline, getTotalDuration } from "./timeline";

// Transitions used between scenes, in order (the list loops if there are more
// scenes than entries). The transition into the outro is always an iris.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyPresentation = TransitionPresentation<any>;

const presentations: (() => AnyPresentation)[] = [
  () => slide({ direction: "from-bottom" }),
  () => wipe({ direction: "from-right" }),
  () => slide({ direction: "from-right" }),
  () => wipe({ direction: "from-left" }),
];

// Generic engine: turns a VideoContent object into a full video.
export const DentalReel: React.FC<VideoContent> = (content) => {
  const T = content.transitionDurationInFrames;
  const timeline = useMemo(() => buildTimeline(content), [content]);
  const total = getTotalDuration(content);
  const voiceClips = useMemo(() => content.voiceClips ?? [], [content.voiceClips]);
  const cues = useMemo(
    () => buildCues(timeline, T, total, voiceClips),
    [timeline, T, total, voiceClips],
  );

  const sfxCues = useMemo(
    () => buildSfxCues(content, timeline, cues, voiceClips),
    [content, timeline, cues, voiceClips],
  );

  const outro = timeline[timeline.length - 1];
  const outroIndex = timeline.length - 1;
  const outroScene = content.presenter.fullImage ? (
    <PresenterOutroScene
      key="outro"
      content={content.outro}
      presenter={content.presenter}
      handle={content.brand.handle}
      brandName={content.brand.name}
      timing={presenterOutroTiming(content, outro.from, outro.durationInFrames, voiceClips)}
      speakingRanges={voiceClips
        .filter((c) => c.sceneIndex === outroIndex)
        .map((c) => [c.from - outro.from, c.from - outro.from + c.durationInFrames])}
      playbackRate={content.voiceover.playbackRate}
    />
  ) : (
    <OutroScene
      key="outro"
      content={content.outro}
      presenter={content.presenter}
      handle={content.brand.handle}
      brandName={content.brand.name}
    />
  );

  // Corner portrait: from the middle of the first transition into the tips
  // until the middle of the transition into the outro.
  const cornerFrom = timeline[1].from + Math.floor(T / 2);
  const cornerTo = outro.from + Math.floor(T / 2);
  const showCorner =
    content.presenter.showInScenes && content.presenter.photo && content.tips.length > 0;

  const scenes: React.ReactNode[] = [
    <IntroScene key="intro" content={content.intro} presenter={content.presenter} />,
    ...content.tips.map((tip, i) => <TipScene key={`tip-${i}`} content={tip} index={i} variant={content.tipStyle} />),
    outroScene,
  ];

  const transitionFor = (i: number, isLast: boolean) => {
    const presentation: AnyPresentation = isLast
      ? iris({ width: VIDEO.width, height: VIDEO.height })
      : presentations[i % presentations.length]();
    const timing = isLast
      ? linearTiming({ durationInFrames: T })
      : springTiming({ durationInFrames: T, config: { damping: 200 } });
    return { presentation, timing };
  };

  return (
    <ThemeProvider colors={content.theme} direction={content.direction}>
      <AbsoluteFill style={{ backgroundColor: content.theme.navy }}>
        <TransitionSeries>
          {scenes.map((scene, i) => {
            const entry = timeline[i];
            const elements = [
              <TransitionSeries.Sequence
                key={`s-${i}`}
                durationInFrames={entry.durationInFrames}
              >
                {scene}
              </TransitionSeries.Sequence>,
            ];
            if (i < scenes.length - 1 && T > 0) {
              const { presentation, timing } = transitionFor(i, i === scenes.length - 2);
              elements.push(
                <TransitionSeries.Transition
                  key={`t-${i}`}
                  presentation={presentation}
                  timing={timing}
                />,
              );
            }
            return elements;
          })}
        </TransitionSeries>
        {showCorner ? (
          <Sequence from={cornerFrom} durationInFrames={cornerTo - cornerFrom} layout="none">
            <CornerPresenter
              presenter={content.presenter}
              voiceClips={voiceClips}
              offset={cornerFrom}
            />
          </Sequence>
        ) : null}
        <ProgressBar timeline={timeline} totalDuration={total} />
        {content.showSubtitles ? <Subtitles cues={cues} /> : null}
        {content.music.src ? (
          <Html5Audio
            src={staticFile(content.music.src)}
            loop
            volume={(f) => musicVolumeAt(f, total, content.music, voiceClips)}
          />
        ) : null}
        {sfxCues.map((cue, i) => (
          <Sequence key={`sfx-${i}`} from={cue.from} durationInFrames={40} layout="none">
            <Html5Audio src={staticFile(`sfx/${cue.sound}.mp3`)} volume={cue.volume} />
          </Sequence>
        ))}
        {voiceClips.map((clip) => (
          <Sequence
            key={`${clip.sceneIndex}-${clip.lineIndex}`}
            from={clip.from}
            durationInFrames={clip.durationInFrames}
            layout="none"
          >
            <Html5Audio
              src={staticFile(clip.src)}
              volume={content.voiceover.volume}
              playbackRate={content.voiceover.playbackRate}
            />
          </Sequence>
        ))}
      </AbsoluteFill>
    </ThemeProvider>
  );
};
