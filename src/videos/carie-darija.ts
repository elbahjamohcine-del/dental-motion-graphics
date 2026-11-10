// ─────────────────────────────────────────────────────────────────────────────
//  STORY REEL: « التسوس: من المينا حتى للعصب »  (≈45 s)
//  Darija voice-over (recorded by the presenter) and Darija subtitles;
//  anatomy labels stay in French. Realistic 3D cross-sections of the same
//  molar at each stage.
//
//  • `voice`: the lines to record (one file, in order, 1–2 s pauses), then
//    npm run voiceover:split -- <file> --video=CarieDarija
//  • `captions`: the subtitle shown while each line is spoken.
//  • Label positions (x, y) are in % of the 9:16 image; keep x between 35 and 65
//    so the dot is not hidden under its pill, and keep right-side labels below
//    y ≈ 24 (the presenter's portrait is in the top-right corner). `at` in s.
// ─────────────────────────────────────────────────────────────────────────────
import type { StoryContent } from "../story/schema";
import { clinic } from "./clinic";

const img = (name: string) => `images/carie/${name}.jpg`;
// Keeps a French word in the right place inside an Arabic line.
const fr = (word: string) => `⁨${word}⁩`;

// Subtitles show exactly what is said.
const lines = (...text: string[]) => ({ voice: text, captions: text });

export const carieDarija: StoryContent = {
  direction: "rtl",
  presenter: clinic.presenter,
  brand: clinic.brand,
  voiceover: clinic.voiceover,
  // Quieter than the other videos, and silent under the hook's stinger
  // (it fades in over ~3.5 s) so the scary sound hits first.
  music: { ...clinic.music, volume: 0.15, duckedVolume: 0.05, fadeInFrames: 110 },
  sfx: clinic.sfx,
  theme: clinic.theme,
  transitionDurationInFrames: 15,
  showSubtitles: true,

  kicker: "نصيحة من طبيب الأسنان",
  title: "التسوس: من المينا حتى للعصب",
  endCard: {
    title: "Cabinet Dentaire Elbahja",
    tagline: "تهلا فضحكتك",
    phone: "06 21 40 66 21",
  },

  scenes: [
    // 1. Hook: a swollen face (abscess) with a stinger… then the small black spot.
    {
      kind: "image",
      headline: { text: "خد منفوخ… من نقطة صغيرة!", highlight: "خد منفوخ", at: 0.15, until: 2.5 },
      sound: { name: "hook-stinger", at: 0, volume: 1 },
      images: [
        { src: img("hook-abscess"), at: 0 },
        { src: img("1-enamel"), at: 2.6 },
      ],
      labels: [{ text: "Carie", x: 50, y: 22, side: "left", at: 3.2 }],
      camera: { from: { scale: 1, x: 60, y: 45 }, to: { scale: 1.5, x: 50, y: 26 } },
      ...lines("وجه منفوخ وألم ما كيتحملش… وكلشي بدا بنقطة كحلة صغيرة فالسنة!"),
      durationInFrames: 150,
    },
    // 2. Anatomy of a healthy tooth
    {
      kind: "image",
      chip: "السنة من الداخل",
      images: [{ src: img("0-healthy"), at: 0 }],
      labels: [
        { text: "Émail", x: 40, y: 19, side: "left", at: 1.6 },
        { text: "Dentine", x: 41, y: 29, side: "left", at: 2.4 },
        { text: "Pulpe", x: 55, y: 34, side: "right", at: 3.2 },
        { text: "Nerfs et vaisseaux", x: 62, y: 55, side: "right", at: 4.2 },
      ],
      camera: { from: { scale: 1, x: 50, y: 40 }, to: { scale: 1.08, x: 50, y: 35 } },
      ...lines("السنة فيها تلاتة د الطبقات:", "المينا، العاج، والعرق فين كاين العصب والأوعية الدموية."),
      durationInFrames: 210,
    },
    // 3. Stage 1: enamel
    {
      kind: "image",
      chip: `المرحلة 1 · ${fr("Émail")}`,
      images: [
        { src: img("0-healthy"), at: 0 },
        { src: img("1-enamel"), at: 0.8 },
      ],
      labels: [
        { text: "Émail", x: 40, y: 19, side: "left", at: 0.4 },
        { text: "Carie", x: 50, y: 24.5, side: "left", at: 1.6 },
      ],
      camera: { from: { scale: 1.08, x: 50, y: 35 }, to: { scale: 1.2, x: 50, y: 25 } },
      ...lines("فالأول، التسوس كيبدا فالمينا، وغالبا ما كيوجعش."),
      durationInFrames: 180,
    },
    // 4. Stage 2: dentin
    {
      kind: "image",
      chip: `المرحلة 2 · ${fr("Dentine")}`,
      images: [{ src: img("2-dentin"), at: 0 }],
      labels: [
        { text: "Carie", x: 50, y: 25, side: "left", at: 0.6 },
        { text: "Dentine", x: 60, y: 30, side: "right", at: 1.4 },
      ],
      camera: { from: { scale: 1.2, x: 50, y: 25 }, to: { scale: 1.28, x: 50, y: 28 } },
      ...lines("ومن بعد كيدخل للعاج،", "وكتبدا تحس بالحساسية للبارد والحلو."),
      durationInFrames: 210,
    },
    // 5. Stage 3: pulp
    {
      kind: "image",
      chip: `المرحلة 3 · ${fr("Pulpe")}`,
      images: [{ src: img("3-pulp"), at: 0 }],
      labels: [
        { text: "Pulpe", x: 44, y: 36, side: "left", at: 0.8 },
        { text: "Inflammation", x: 58, y: 34, side: "right", at: 3.2 },
      ],
      camera: { from: { scale: 1.28, x: 50, y: 30 }, to: { scale: 1.1, x: 50, y: 38 } },
      ...lines(
        "إلا وصل للعرق ديال السن، فين كاين العصب والأوعية الدموية،",
        "يقدر يسبب التهاب وألم قوي.",
      ),
      durationInFrames: 240,
    },
    // 6. Treatment: root canal
    {
      kind: "image",
      chip: "العلاج · علاج العصب",
      images: [{ src: img("4-root-canal"), at: 0 }],
      labels: [
        { text: "Canaux traités", x: 62, y: 55, side: "right", at: 1.0 },
        { text: "Dent conservée", x: 42, y: 26, side: "left", at: 2.4 },
      ],
      camera: { from: { scale: 1.1, x: 50, y: 40 }, to: { scale: 1, x: 50, y: 35 } },
      ...lines("فهاد الحالة، ممكن تحتاج علاج العصب باش نحافظو على السن."),
      durationInFrames: 210,
    },
    // 7. Advice + end card
    {
      kind: "end",
      images: [],
      labels: [],
      camera: { from: { scale: 1, x: 50, y: 50 }, to: { scale: 1, x: 50, y: 50 } },
      ...lines("النصيحة ديالي: ما تستناش حتى يوجعك سنك،", "الكشف المبكر كيقدر ينقذ ليك سنانك!"),
      durationInFrames: 240,
    },
  ],
};
