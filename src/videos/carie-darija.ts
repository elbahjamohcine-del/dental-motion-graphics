// ─────────────────────────────────────────────────────────────────────────────
//  STORY REEL: « La carie : de l'émail au nerf »
//  Darija voice-over (recorded by the presenter), French subtitles, realistic
//  3D cross-sections of the same molar at each stage.
//
//  • `voice`: the lines to record (one file, in order, 1–2 s pauses), then
//    npm run voiceover:split -- <file> --video=CarieDarija
//  • `captions`: the French subtitle shown while each line is spoken.
//  • Label positions (x, y) are in % of the 9:16 frame; `at` in seconds.
// ─────────────────────────────────────────────────────────────────────────────
import type { StoryContent } from "../story/schema";
import { clinic } from "./clinic";

const img = (name: string) => `images/carie/${name}.jpg`;

export const carieDarija: StoryContent = {
  direction: "ltr", // on-screen texts are in French
  presenter: clinic.presenter,
  brand: clinic.brand,
  voiceover: clinic.voiceover,
  music: clinic.music,
  sfx: clinic.sfx,
  theme: clinic.theme,
  transitionDurationInFrames: 15,
  showSubtitles: true,

  kicker: "Conseil dentaire",
  title: "La carie : de l'émail au nerf",
  endCard: {
    title: "Cabinet Dentaire Elbahja",
    tagline: "Prenez soin de votre sourire.",
    phone: "06 21 40 66 21",
  },

  scenes: [
    {
      kind: "intro",
      images: [],
      labels: [],
      camera: { from: { scale: 1, x: 50, y: 50 }, to: { scale: 1, x: 50, y: 50 } },
      voice: ["واش عارف أن تسوس صغير يقدر يوصل حتى للعصب ديال السن؟"],
      captions: ["Saviez-vous qu'une petite carie peut atteindre le nerf de la dent ?"],
      durationInFrames: 120,
    },
    {
      kind: "image",
      chip: "Stade 1 · Émail",
      images: [
        { src: img("0-healthy"), at: 0 },
        { src: img("1-enamel"), at: 2.4 },
      ],
      labels: [
        { text: "Émail", x: 40, y: 22, side: "left", at: 0.3 },
        { text: "Dentine", x: 58, y: 30, side: "right", at: 0.8 },
        { text: "Pulpe", x: 50, y: 38, side: "left", at: 1.3 },
        { text: "Nerfs et vaisseaux", x: 47, y: 52, side: "right", at: 1.8 },
      ],
      camera: { from: { scale: 1, x: 50, y: 35 }, to: { scale: 1.12, x: 50, y: 25 } },
      voice: ["فالأول، التسوس كيبدا فطبقة المينا،"],
      captions: ["Au début, la carie commence dans l'émail,"],
      durationInFrames: 165,
    },
    {
      kind: "image",
      chip: "Stade 2 · Dentine",
      images: [{ src: img("2-dentin"), at: 0 }],
      labels: [{ text: "Carie", x: 46, y: 24, side: "left", at: 0.8 }],
      camera: { from: { scale: 1.12, x: 50, y: 25 }, to: { scale: 1.25, x: 50, y: 28 } },
      voice: ["ومن بعد كيقدر يدخل للعاج ويتعمق أكثر."],
      captions: ["puis elle peut pénétrer dans la dentine et s'approfondir."],
      durationInFrames: 150,
    },
    {
      kind: "image",
      chip: "Stade 3 · Pulpe",
      images: [{ src: img("3-pulp"), at: 0 }],
      labels: [
        { text: "Pulpe", x: 50, y: 38, side: "left", at: 0.6 },
        { text: "Inflammation", x: 52, y: 46, side: "right", at: 2.2 },
      ],
      camera: { from: { scale: 1.25, x: 50, y: 30 }, to: { scale: 1.1, x: 50, y: 38 } },
      voice: [
        "إلا وصل للب ديال السن، فين كاين العصب والأوعية الدموية،",
        "يقدر يسبب التهاب وألم قوي.",
      ],
      captions: [
        "Si elle atteint la pulpe, où se trouvent le nerf et les vaisseaux sanguins,",
        "elle peut provoquer une inflammation et une douleur intense.",
      ],
      durationInFrames: 195,
    },
    {
      kind: "image",
      chip: "Traitement · Dévitalisation",
      images: [{ src: img("4-root-canal"), at: 0 }],
      labels: [
        { text: "Canaux traités", x: 50, y: 50, side: "right", at: 0.8 },
        { text: "Dent conservée", x: 50, y: 22, side: "left", at: 1.8 },
      ],
      camera: { from: { scale: 1.1, x: 50, y: 40 }, to: { scale: 1, x: 50, y: 35 } },
      voice: ["فهاد الحالة، ممكن تحتاج علاج العصب باش نحافظو على السن."],
      captions: ["Dans ce cas, un traitement du nerf peut être nécessaire pour conserver la dent."],
      durationInFrames: 150,
    },
    {
      kind: "end",
      images: [],
      labels: [],
      camera: { from: { scale: 1, x: 50, y: 50 }, to: { scale: 1, x: 50, y: 50 } },
      voice: ["النصيحة ديالي: ما تستناش حتى يوجعك سنك،", "الكشف المبكر كيقدر ينقذ ليك سنانك!"],
      captions: ["Mon conseil : n'attendez pas d'avoir mal,", "le dépistage précoce peut sauver vos dents !"],
      durationInFrames: 195,
    },
  ],
};
