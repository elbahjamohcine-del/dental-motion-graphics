// Background music volume: fades in and out, and "ducks" (gets quieter)
// while the voice-over speaks so the voice always stays clear.
import { interpolate } from "remotion";
import type { VideoContent, VoiceClip } from "./schema";

const RAMP = 8; // frames to go down before a line and back up after it

export const musicVolumeAt = (
  frame: number,
  total: number,
  music: VideoContent["music"],
  voiceClips: VoiceClip[],
): number => {
  // 1 = fully ducked, 0 = normal level.
  const duck = voiceClips.reduce((max, clip) => {
    const end = clip.from + clip.durationInFrames;
    const amount = interpolate(
      frame,
      [clip.from - RAMP, clip.from, end, end + RAMP],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
    return Math.max(max, amount);
  }, 0);
  const level = interpolate(duck, [0, 1], [music.volume, music.duckedVolume]);
  const fade = Math.min(
    interpolate(frame, [0, Math.max(1, music.fadeInFrames)], [0, 1], {
      extrapolateRight: "clamp",
    }),
    interpolate(frame, [total - Math.max(1, music.fadeOutFrames), total], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  return level * fade;
};
