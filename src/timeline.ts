import type { VideoContent } from "./schema";

export type TimelineEntry = {
  kind: "intro" | "tip" | "outro";
  index: number;
  from: number; // absolute start frame in the final video
  durationInFrames: number;
  subtitles: string[];
};

// Computes where each scene starts in the final video. With TransitionSeries,
// consecutive scenes overlap by the transition duration.
export const buildTimeline = (content: VideoContent): TimelineEntry[] => {
  const scenes: Omit<TimelineEntry, "from">[] = [
    {
      kind: "intro",
      index: 0,
      durationInFrames: content.intro.durationInFrames,
      subtitles: content.intro.subtitles,
    },
    ...content.tips.map((tip, i) => ({
      kind: "tip" as const,
      index: i,
      durationInFrames: tip.durationInFrames,
      subtitles: tip.subtitles,
    })),
    {
      kind: "outro",
      index: 0,
      durationInFrames: content.outro.durationInFrames,
      subtitles: content.outro.subtitles,
    },
  ];

  let cursor = 0;
  return scenes.map((scene, i) => {
    const from = cursor;
    cursor += scene.durationInFrames;
    if (i < scenes.length - 1) {
      cursor -= content.transitionDurationInFrames;
    }
    return { ...scene, from };
  });
};

export const getTotalDuration = (content: VideoContent): number => {
  const timeline = buildTimeline(content);
  const last = timeline[timeline.length - 1];
  return last.from + last.durationInFrames;
};
