import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Presenter, VoiceClip } from "../schema";
import { PresenterBadge } from "./PresenterBadge";
import { SpeakingBars } from "./SpeakingBars";
import { useColors } from "./ThemeContext";

const SIZE = 150;

// Round portrait in the top corner during the tip scenes, with bars that
// move while the voice-over speaks. Used inside a <Sequence>: frame 0 = when
// it appears, `durationInFrames` = when it is gone.
export const CornerPresenter: React.FC<{
  presenter: Presenter;
  voiceClips: VoiceClip[];
  /** Absolute frame where this Sequence starts (to compare with voice clips). */
  offset: number;
}> = ({ presenter, voiceClips, offset }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const c = useColors();

  const absolute = frame + offset;
  const speaking = voiceClips.some(
    (clip) => absolute >= clip.from && absolute < clip.from + clip.durationInFrames,
  );
  const enter = spring({ frame, fps, config: { damping: 14 } });
  const exit = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pulse = speaking ? 1 + Math.sin(frame / 3) * 0.04 : 1;

  return (
    <div
      style={{
        position: "absolute",
        top: 190,
        insetInlineStart: 56,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        opacity: Math.min(enter, exit),
        transform: `scale(${Math.min(enter, exit)})`,
      }}
    >
      <div
        style={{
          borderRadius: "50%",
          boxShadow: speaking ? `0 0 0 ${8 * pulse}px ${c.turquoise}55` : "none",
        }}
      >
        <PresenterBadge presenter={presenter} size={SIZE} />
      </div>
      <div
        style={{
          padding: "8px 16px",
          borderRadius: 999,
          background: c.navy,
          boxShadow: "0 8px 20px rgba(11,37,69,0.25)",
        }}
      >
        <SpeakingBars speaking={speaking} color={c.turquoiseLight} height={26} />
      </div>
    </div>
  );
};
