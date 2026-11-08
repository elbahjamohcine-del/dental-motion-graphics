// Voice-over timing for story reels: narration lines per scene, voice clips
// placed with the shared layoutVoice, subtitles taken from `captions`.
import type { TimelineEntry } from "../timeline";
import {
  applyPronunciations,
  layoutVoice,
  type ManifestEntry,
  type VoiceLine,
} from "../voiceover";
import type { StoryContent } from "./schema";

export const storyVoiceLines = (story: StoryContent): VoiceLine[] =>
  story.scenes.flatMap((scene, sceneIndex) =>
    scene.voice
      .map((text, lineIndex) => ({
        key: `s${sceneIndex + 1}-${lineIndex}`,
        sceneIndex,
        lineIndex,
        text: text.trim(),
        spoken: applyPronunciations(text.trim(), story.voiceover.pronunciations),
      }))
      .filter((line) => line.text.length > 0),
  );

// Scene start frames (scenes overlap by the transition), with the subtitles
// to show: the captions (e.g. French) rather than the spoken text.
export const storyTimeline = (story: StoryContent): TimelineEntry[] => {
  let cursor = 0;
  return story.scenes.map((scene, i) => {
    const from = cursor;
    cursor += scene.durationInFrames - (i < story.scenes.length - 1 ? story.transitionDurationInFrames : 0);
    return {
      kind: i === 0 ? "intro" : i === story.scenes.length - 1 ? "outro" : "tip",
      index: i,
      from,
      durationInFrames: scene.durationInFrames,
      subtitles: scene.captions,
    };
  });
};

export const storyDuration = (story: StoryContent) => {
  const last = storyTimeline(story).at(-1)!;
  return last.from + last.durationInFrames;
};

export const applyStoryVoiceover = (
  story: StoryContent,
  entries: Record<string, ManifestEntry> | undefined,
  fps: number,
): StoryContent => {
  if (!story.voiceover.enabled || !entries) {
    return { ...story, voiceClips: [] };
  }
  const { durations, clips } = layoutVoice(
    storyVoiceLines(story),
    story.scenes.map((s) => s.durationInFrames),
    story.transitionDurationInFrames,
    story.voiceover,
    entries,
    fps,
  );
  const adjusted = {
    ...story,
    scenes: story.scenes.map((s, i) => ({ ...s, durationInFrames: durations[i] })),
  };
  const timeline = storyTimeline(adjusted);
  const voiceClips = clips.map(({ offset, ...clip }) => ({
    ...clip,
    from: timeline[clip.sceneIndex].from + offset,
  }));
  return { ...adjusted, voiceClips };
};
