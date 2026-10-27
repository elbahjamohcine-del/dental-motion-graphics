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
import { AbsoluteFill } from "remotion";
import "./fonts";
import { ProgressBar } from "./components/ProgressBar";
import { buildCues, Subtitles } from "./components/Subtitles";
import { ThemeProvider } from "./components/ThemeContext";
import { IntroScene } from "./scenes/IntroScene";
import { OutroScene } from "./scenes/OutroScene";
import { TipScene } from "./scenes/TipScene";
import type { VideoContent } from "./schema";
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
  const cues = useMemo(() => buildCues(timeline, T, total), [timeline, T, total]);

  const scenes: React.ReactNode[] = [
    <IntroScene key="intro" content={content.intro} />,
    ...content.tips.map((tip, i) => <TipScene key={`tip-${i}`} content={tip} index={i} />),
    <OutroScene
      key="outro"
      content={content.outro}
      handle={content.brand.handle}
      brandName={content.brand.name}
    />,
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
    <ThemeProvider colors={content.theme}>
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
        <ProgressBar timeline={timeline} totalDuration={total} />
        {content.showSubtitles ? <Subtitles cues={cues} /> : null}
      </AbsoluteFill>
    </ThemeProvider>
  );
};
