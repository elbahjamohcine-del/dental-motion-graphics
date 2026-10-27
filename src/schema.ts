import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const iconNames = [
  "tooth",
  "rinse",
  "cigarette",
  "straw",
  "hotFood",
  "ice",
  "gauze",
  "toothbrush",
  "pill",
  "phone",
  "check",
] as const;

export const iconSchema = z.enum(iconNames);
export type IconName = z.infer<typeof iconSchema>;

const subtitles = z
  .array(z.string())
  .describe("Subtitle lines shown one after the other during the scene");

export const introSchema = z.object({
  kicker: z.string(),
  bigNumber: z.string().describe("Large highlighted number, e.g. 3"),
  title: z.string(),
  subtitle: z.string(),
  icon: iconSchema,
  subtitles,
  durationInFrames: z.number().int().min(30),
});

export const tipSchema = z.object({
  label: z.string().describe("e.g. Erreur n°1"),
  title: z.string(),
  icon: iconSchema,
  explanation: z.string().describe("Short line under the title"),
  goodPracticeLabel: z.string(),
  goodPractice: z.string(),
  subtitles,
  durationInFrames: z.number().int().min(30),
});

export const outroSchema = z.object({
  title: z.string(),
  checklist: z.array(
    z.object({ icon: iconSchema, text: z.string() }),
  ),
  warning: z.string(),
  cta: z.string(),
  disclaimer: z.string(),
  subtitles,
  durationInFrames: z.number().int().min(30),
});

export const themeSchema = z.object({
  navy: zColor(),
  navyDeep: zColor(),
  turquoise: zColor(),
  turquoiseLight: zColor(),
  white: zColor(),
  surface: zColor(),
  alert: zColor(),
});

export const videoSchema = z.object({
  brand: z.object({
    name: z.string().describe("Clinic / doctor name"),
    handle: z.string().describe("Social handle shown in the CTA"),
  }),
  intro: introSchema,
  tips: z.array(tipSchema).min(1),
  outro: outroSchema,
  transitionDurationInFrames: z.number().int().min(0).max(30),
  showSubtitles: z.boolean(),
  theme: themeSchema,
});

export type VideoContent = z.infer<typeof videoSchema>;
export type IntroContent = z.infer<typeof introSchema>;
export type TipContent = z.infer<typeof tipSchema>;
export type OutroContent = z.infer<typeof outroSchema>;
