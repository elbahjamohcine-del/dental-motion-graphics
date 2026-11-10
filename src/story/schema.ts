// "Story" reels: a sequence of full-screen scenes (realistic images with a
// camera move and labels, or the presenter), a voice-over in one language and
// subtitles in another (e.g. Darija voice, French subtitles), and an end card.
import { z } from "zod";
import { musicSchema, presenterSchema, sfxSchema, themeSchema, voiceClipSchema, voiceoverSchema } from "../schema";

// A point of the 9:16 frame, in % of its width (x) and height (y).
const point = { x: z.number().min(0).max(100), y: z.number().min(0).max(100) };

export const storyLabelSchema = z.object({
  text: z.string(),
  ...point,
  side: z.enum(["left", "right"]).describe("Where the label text sits"),
  at: z.number().min(0).describe("Seconds after the scene start"),
});

export const storySceneSchema = z.object({
  kind: z.enum(["intro", "image", "end"]),
  chip: z.string().optional().describe("Small title at the top, e.g. « Stade 1 · Émail »"),
  // Big punchy text over the image (used for the hook).
  headline: z
    .object({
      text: z.string(),
      highlight: z.string().optional(),
      at: z.number().min(0),
      until: z.number().min(0).optional().describe("Seconds: the headline leaves (default: stays)"),
    })
    .optional(),
  // A sound effect played at `at` seconds (file in public/sfx/, without .mp3).
  sound: z.object({ name: z.string(), at: z.number().min(0), volume: z.number().min(0).max(1) }).optional(),
  // Full-screen 9:16 images; each one fades in over the previous one at `at`.
  images: z.array(z.object({ src: z.string(), at: z.number().min(0) })),
  labels: z.array(storyLabelSchema),
  // Slow zoom towards a point: from → to over the scene.
  camera: z.object({
    from: z.object({ scale: z.number(), ...point }),
    to: z.object({ scale: z.number(), ...point }),
  }),
  voice: z.array(z.string()).describe("Narration lines (spoken)"),
  captions: z.array(z.string()).describe("Subtitles shown for each narration line"),
  durationInFrames: z.number().int().min(30),
});

export const storySchema = z.object({
  direction: z.enum(["rtl", "ltr"]).describe("Direction of the on-screen text"),
  presenter: presenterSchema,
  brand: z.object({ name: z.string(), handle: z.string() }),
  title: z.string().describe("Intro title"),
  kicker: z.string(),
  endCard: z.object({ title: z.string(), tagline: z.string(), phone: z.string() }),
  scenes: z.array(storySceneSchema).min(2),
  transitionDurationInFrames: z.number().int().min(0).max(30),
  showSubtitles: z.boolean(),
  voiceover: voiceoverSchema,
  music: musicSchema,
  sfx: sfxSchema,
  theme: themeSchema,
  voiceClips: z.array(voiceClipSchema).optional(),
});

export type StoryContent = z.infer<typeof storySchema>;
export type StoryScene = z.infer<typeof storySceneSchema>;
