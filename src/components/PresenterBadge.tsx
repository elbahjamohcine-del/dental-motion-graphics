import React from "react";
import {
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AnimatedIcon } from "../icons/AnimatedIcon";
import type { Presenter } from "../schema";
import { FONTS } from "../theme";
import { useColors } from "./ThemeContext";

type Props = {
  presenter: Presenter;
  size: number;
  delay?: number;
  /** Name plate overlapping the bottom of the photo. */
  showNamePlate?: boolean;
};

// Round presenter photo with a rotating ring, a small tooth badge and an
// optional name plate.
export const PresenterBadge: React.FC<Props> = ({
  presenter,
  size,
  delay = 0,
  showNamePlate = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = useColors();

  const enter = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 110 } });
  const plate = spring({ frame: frame - delay - 14, fps, config: { damping: 14 } });
  const badge = spring({ frame: frame - delay - 22, fps, config: { damping: 9, stiffness: 160 } });
  const float = Math.sin((frame - delay) / 18) * 5;
  const badgeSize = size * 0.27;

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        transform: `translateY(${float}px) scale(${enter})`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -size * 0.07,
          borderRadius: "50%",
          border: `3px dashed ${c.turquoise}`,
          opacity: 0.6,
          transform: `rotate(${frame * 0.6}deg)`,
        }}
      />
      <Img
        src={staticFile(presenter.photo)}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          border: `${size * 0.03}px solid ${c.turquoise}`,
          boxShadow: `0 0 ${size * 0.25}px rgba(20,184,166,0.35)`,
          boxSizing: "border-box",
        }}
      />
      <div
        style={{
          position: "absolute",
          insetInlineEnd: -size * 0.01,
          top: size * 0.02,
          width: badgeSize,
          height: badgeSize,
          borderRadius: "50%",
          background: c.turquoise,
          border: `${size * 0.018}px solid ${c.white}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${badge})`,
        }}
      >
        <AnimatedIcon name="tooth" size={badgeSize * 0.62} color={c.white} strokeWidth={14} />
      </div>
      {showNamePlate ? (
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: -size * 0.16,
            transform: `translateX(-50%) translateY(${interpolate(plate, [0, 1], [20, 0])}px)`,
            opacity: plate,
            padding: "10px 30px 12px",
            borderRadius: 24,
            background: c.white,
            boxShadow: "0 14px 34px rgba(0,0,0,0.3)",
            textAlign: "center",
            whiteSpace: "nowrap",
          }}
        >
          <div
            dir="auto"
            style={{ fontFamily: FONTS.title, fontWeight: 800, fontSize: 34, color: c.navy, lineHeight: 1.25 }}
          >
            {presenter.name}
          </div>
          <div
            dir="auto"
            style={{ fontFamily: FONTS.body, fontWeight: 500, fontSize: 26, color: c.turquoise, lineHeight: 1.3 }}
          >
            {presenter.title}
          </div>
        </div>
      ) : null}
    </div>
  );
};
