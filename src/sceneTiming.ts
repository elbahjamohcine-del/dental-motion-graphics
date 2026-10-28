// When things appear in each scene (frames from the start of the scene).
// Shared by the scenes and the sound effects so they always stay in sync.
import type { VideoContent, VoiceClip } from "./schema";

export const INTRO_TIMING = {
  kicker: 0,
  badge: 4,
  number: 18,
  title: 28,
  subtitle: 40,
  underline: 48,
};

export const tipTiming = (duration: number) => ({
  label: 2,
  icon: 6,
  title: 14,
  explanation: 34,
  stamp: 40, // icon delay (6) + stamp delay (34)
  card: Math.round(duration * 0.36),
});

// Outro without a full portrait: checklist, warning, call to action.
export const classicOutroTiming = (items: number) => {
  const listStart = 14;
  const listStagger = 10;
  const warning = listStart + items * listStagger + 8;
  return { title: 0, listStart, listStagger, warning, cta: warning + 22 };
};

// Outro with the presenter: part 1 = title + checklist, part 2 = warning +
// call to action. Part 2 starts with the second narration line if it has a
// voice clip, otherwise halfway through.
export const presenterOutroTiming = (
  content: VideoContent,
  sceneFrom: number,
  duration: number,
  voiceClips: VoiceClip[],
) => {
  const outroIndex = content.tips.length + 1;
  const second = voiceClips.find((c) => c.sceneIndex === outroIndex && c.lineIndex === 1);
  const raw = second ? second.from - sceneFrom - 4 : Math.round(duration * 0.5);
  const secondPart = Math.min(Math.max(raw, 60), duration - 50);
  return {
    title: 8,
    listStart: 16,
    listStagger: 9,
    secondPart,
    warning: secondPart + 4,
    cta: secondPart + 14,
    footer: secondPart + 24,
    // The talking video starts with the first narration line.
    talkStart: Math.max(
      0,
      (voiceClips.find((c) => c.sceneIndex === outroIndex && c.lineIndex === 0)?.from ??
        sceneFrom) - sceneFrom,
    ),
  };
};
