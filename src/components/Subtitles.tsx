import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONTS, SAFE } from "../theme";
import type { VoiceClip } from "../schema";
import type { TimelineEntry } from "../timeline";
import { useColors } from "./ThemeContext";

export type SubtitleCue = {
  text: string;
  from: number;
  to: number;
};

// Subtitle timing. When every line of a scene has a voice clip, each line is
// shown while it is spoken. Otherwise the lines are spread over the time the
// scene is fully visible, proportionally to their length.
export const buildCues = (
  timeline: TimelineEntry[],
  transition: number,
  totalDuration: number,
  voiceClips: VoiceClip[] = [],
): SubtitleCue[] => {
  return timeline.flatMap((scene, i) => {
    const start = scene.from + (i === 0 ? 0 : Math.floor(transition / 2)) + 4;
    const next = timeline[i + 1];
    const end = next
      ? next.from + Math.floor(transition / 2)
      : totalDuration - 2;
    const lines = scene.subtitles.filter((s) => s.trim().length > 0);

    const clips = voiceClips.filter((c) => c.sceneIndex === i);
    if (clips.length > 0 && clips.length === lines.length) {
      return clips.map((clip, j) => ({
        text: lines[j],
        from: clip.from - 2,
        // Stay on screen until the next line starts (or the scene ends).
        to: j < clips.length - 1 ? clips[j + 1].from - 2 : end,
      }));
    }

    const totalChars = lines.reduce((sum, l) => sum + l.length, 0);

    let cursor = start;
    return lines.map((text) => {
      const length = ((end - start) * text.length) / totalChars;
      const cue = { text, from: Math.round(cursor), to: Math.round(cursor + length) };
      cursor += length;
      return cue;
    });
  });
};

// Burned-in subtitles with a karaoke-style word highlight.
export const Subtitles: React.FC<{ cues: SubtitleCue[] }> = ({ cues }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = useColors();

  const cue = cues.find((q) => frame >= q.from && frame < q.to);
  if (!cue) {
    return null;
  }

  const local = frame - cue.from;
  const duration = cue.to - cue.from;
  const enter = spring({ frame: local, fps, config: { damping: 14, stiffness: 180 } });
  const exit = interpolate(local, [duration - 5, duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const words = cue.text.split(" ");
  // Words light up progressively over the first 80% of the cue.
  const spoken = interpolate(local, [0, duration * 0.8], [0, words.length], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: SAFE.bottom + 20,
        paddingLeft: SAFE.side,
        paddingRight: SAFE.side,
      }}
    >
      <div
        style={{
          maxWidth: 900,
          padding: "22px 36px",
          borderRadius: 28,
          background: "rgba(6, 22, 48, 0.88)",
          boxShadow: "0 18px 40px rgba(6,22,48,0.3)",
          border: `2px solid ${c.turquoise}55`,
          textAlign: "center",
          textWrap: "balance",
          fontFamily: FONTS.body,
          fontWeight: 600,
          fontSize: 46,
          lineHeight: 1.3,
          opacity: exit,
          transform: `translateY(${interpolate(enter, [0, 1], [24, 0])}px) scale(${interpolate(enter, [0, 1], [0.92, 1])})`,
        }}
      >
        {words.map((word, i) => {
          const isCurrent = i < spoken && i >= spoken - 1;
          const isSpoken = i < spoken;
          return (
            <span
              key={i}
              style={{
                color: isCurrent ? c.turquoiseLight : c.white,
                opacity: isSpoken ? 1 : 0.55,
              }}
            >
              {word}
              {i < words.length - 1 ? " " : ""}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
