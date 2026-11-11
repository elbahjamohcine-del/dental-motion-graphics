// ─────────────────────────────────────────────────────────────────────────────
//  STORY REEL: « علاش ما خاصكش تخاف من قتيل العرق »  (≈40 s)
//  The presenter speaks on camera (talk scenes full screen, a bubble over the
//  animations). Until the video is recorded, the talk scenes show the
//  presenter's portrait. Darija voice and subtitles, French anatomy labels.
//
//  • `voice`: the lines to record (in order, 1–2 s pauses), then
//    npm run voiceover:split -- <file> --video=RootCanalDarija
//  • Label positions (x, y) are in % of the 9:16 image (see carie-darija.ts).
// ─────────────────────────────────────────────────────────────────────────────
import type { StoryContent } from "../story/schema";
import { clinic } from "./clinic";

const img = (name: string) => `images/carie/${name}.jpg`;
const lines = (...text: string[]) => ({ voice: text, captions: text });
const still = { from: { scale: 1, x: 50, y: 50 }, to: { scale: 1, x: 50, y: 50 } };

export const rootCanalDarija: StoryContent = {
  direction: "rtl",
  presenter: clinic.presenter,
  brand: clinic.brand,
  voiceover: clinic.voiceover,
  music: { ...clinic.music, src: "music/clinic-reassuring.mp3", volume: 0.15, duckedVolume: 0.05, fadeInFrames: 30 },
  sfx: clinic.sfx,
  theme: clinic.theme,
  transitionDurationInFrames: 15,
  showSubtitles: true,

  kicker: "نصيحة من طبيب الأسنان",
  title: "علاش ما خاصكش تخاف من قتيل العرق",
  endCard: {
    title: "Cabinet Dentaire Elbahja",
    tagline: "تهلا فضحكتك",
    phone: "06 21 40 66 21",
  },

  scenes: [
    // 1. Hook: the presenter, full screen.
    {
      kind: "talk",
      headline: { text: "قتيل العرق… كيوجع؟", highlight: "كيوجع؟", at: 0.1 },
      images: [],
      labels: [],
      camera: still,
      ...lines("قتيل العرق؟ لا لا لا، ما بغيتش!", "إلا كنتي كتقول هادشي، تسنى… خليني نقوليك الحقيقة."),
      durationInFrames: 180,
    },
    // 2. Why it hurts: the inflamed pulp.
    {
      kind: "image",
      chip: "العرق ملتهب",
      images: [{ src: img("3-pulp"), at: 0 }],
      labels: [
        { text: "Pulpe", x: 44, y: 36, side: "left", at: 0.8 },
        { text: "Inflammation", x: 58, y: 34, side: "right", at: 2.5 },
      ],
      camera: { from: { scale: 1.25, x: 50, y: 30 }, to: { scale: 1.1, x: 50, y: 38 } },
      ...lines(
        "ملي كيوصل التسوس للعرق، كيدير التهاب، وهادا هو اللي كيعطيك داك الضرب القوي.",
        "قتيل العرق ماشي هو اللي كيوجع… هو اللي كيحيد ليك الوجع.",
      ),
      durationInFrames: 255,
    },
    // 3. The 3 steps of the treatment.
    {
      kind: "steps",
      chip: "كيفاش كيدار قتيل العرق؟",
      steps: [
        { icon: "syringe", text: "البنج: ما كتحس بوالو", line: 0, at: 0.4 },
        { icon: "endoFile", text: "تنقية العرق المريض", line: 1, at: 3 },
        { icon: "canalFill", text: "تعمير القنوات", line: 2, at: 5.8 },
      ],
      images: [],
      labels: [],
      camera: still,
      ...lines(
        "أولا، كنديرو البنج، وما كتحس بوالو.",
        "من بعد كننقيو العرق المريض من الداخل ديال السنة،",
        "وكنعمرو القنوات باش ما يرجعش الميكروب.",
      ),
      durationInFrames: 255,
    },
    // 4. The result: a treated tooth that stays.
    {
      kind: "image",
      chip: "بحال حشوة عادية",
      images: [{ src: img("4-root-canal"), at: 0 }],
      labels: [
        { text: "Canaux traités", x: 62, y: 55, side: "right", at: 0.6 },
        { text: "Dent conservée", x: 42, y: 26, side: "left", at: 1.6 },
      ],
      camera: { from: { scale: 1.1, x: 50, y: 40 }, to: { scale: 1, x: 50, y: 35 } },
      ...lines("كتحس بحال إلا كتدير غير حشوة عادية."),
      durationInFrames: 120,
    },
    // 5. After the treatment + advice: the presenter, full screen.
    {
      kind: "talk",
      images: [],
      labels: [],
      camera: still,
      ...lines(
        "ومن بعد، ممكن تحس بشوية الحساسية نهار ولا جوج، وهادشي عادي.",
        "والأهم: السنة كتبقى فبلاصتها، وما كتحتاجش تقلعها!",
        "ما تخليش الخوف يخسر ليك سنانك. دوز عندنا، ونشرحو ليك كلشي.",
      ),
      durationInFrames: 375,
    },
    // 6. End card.
    {
      kind: "end",
      images: [],
      labels: [],
      camera: still,
      ...lines(),
      durationInFrames: 105,
    },
  ],
};
