// Sound effects: which sound plays at which frame. Built from the same timings
// as the animations (sceneTiming.ts), so sounds always match what appears.
import type { SubtitleCue } from "./components/Subtitles";
import type { VideoContent, VoiceClip } from "./schema";
import {
  classicOutroTiming,
  INTRO_TIMING,
  presenterOutroTiming,
  tipTiming,
} from "./sceneTiming";
import type { TimelineEntry } from "./timeline";

export type SfxName =
  | "whoosh"
  | "pop"
  | "tick"
  | "click"
  | "error"
  | "ding"
  | "impact"
  | "success";

// Relative loudness of each sound (multiplied by sfx.volume).
const LEVEL: Record<SfxName, number> = {
  whoosh: 0.7,
  pop: 0.75,
  tick: 0.45,
  click: 0.7,
  error: 0.8,
  ding: 0.75,
  impact: 1,
  success: 0.85,
};

export type SfxCue = { from: number; sound: SfxName; volume: number };

export const buildSfxCues = (
  content: VideoContent,
  timeline: TimelineEntry[],
  subtitleCues: SubtitleCue[],
  voiceClips: VoiceClip[],
): SfxCue[] => {
  if (!content.sfx.enabled) return [];
  const cues: { from: number; sound: SfxName }[] = [];
  const add = (from: number, sound: SfxName) => cues.push({ from, sound });

  // Transitions between scenes.
  timeline.slice(1).forEach((scene) => add(scene.from, "whoosh"));

  // Intro.
  add(INTRO_TIMING.badge, "pop");
  add(INTRO_TIMING.number, "impact");
  add(INTRO_TIMING.title, "pop");

  // Tips.
  timeline
    .filter((s) => s.kind === "tip")
    .forEach((scene) => {
      const t = tipTiming(scene.durationInFrames);
      add(scene.from + t.label, "click");
      add(scene.from + t.icon, "pop");
      add(scene.from + t.stamp, content.tipStyle === "mistake" ? "error" : "pop");
      add(scene.from + t.card, "ding");
    });

  // Outro.
  const outro = timeline[timeline.length - 1];
  const items = content.outro.checklist.length;
  if (content.presenter.fullImage) {
    const t = presenterOutroTiming(content, outro.from, outro.durationInFrames, voiceClips);
    add(outro.from + t.title, "pop");
    for (let i = 0; i < items; i++) add(outro.from + t.listStart + i * t.listStagger, "click");
    add(outro.from + t.warning, "pop");
    add(outro.from + t.cta, "success");
  } else {
    const t = classicOutroTiming(items);
    add(outro.from + t.title, "pop");
    for (let i = 0; i < items; i++) add(outro.from + t.listStart + i * t.listStagger, "click");
    add(outro.from + t.warning, "pop");
    add(outro.from + t.cta, "success");
  }

  // Soft tick for each subtitle line, unless another sound plays right then.
  if (content.sfx.subtitleTicks) {
    for (const cue of subtitleCues) {
      if (!cues.some((c) => Math.abs(c.from - cue.from) < 8)) add(cue.from, "tick");
    }
  }

  return cues
    .filter((c) => c.from >= 0)
    .sort((a, b) => a.from - b.from)
    .map((c) => ({ ...c, volume: LEVEL[c.sound] * content.sfx.volume }));
};
