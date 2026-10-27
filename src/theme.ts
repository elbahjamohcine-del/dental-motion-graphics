// Design tokens shared by every scene. Colors can also be overridden per video
// (see `theme` in the video content files / the Studio props panel).
export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
} as const;

export const defaultColors = {
  navy: "#0B2545", // dark blue: titles, intro/outro backgrounds
  navyDeep: "#061630",
  turquoise: "#14B8A6", // main accent
  turquoiseLight: "#9EEBE2",
  white: "#FFFFFF",
  surface: "#F2F8FA", // off-white backgrounds
  alert: "#E4572E", // used sparingly for the "erreur" stamp
};

export type Colors = typeof defaultColors;

export const FONTS = {
  title: "Montserrat, Inter, sans-serif",
  body: "Inter, sans-serif",
};

// Instagram / TikTok overlay their UI on the top ~220px, the bottom ~380px and
// the right ~140px. Important content stays inside this zone.
export const SAFE = {
  top: 200,
  bottom: 380,
  side: 90,
};
