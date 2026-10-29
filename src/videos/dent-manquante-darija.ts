// ─────────────────────────────────────────────────────────────────────────────
//  VIDEO: « 3 حلول باش تعوض سنة ناقصة »
//  (Dent manquante : 3 solutions pour la remplacer, en darija marocaine)
//
//  Texts and timings of this video. Shared settings (presenter, voice, music,
//  colors…) come from clinic.ts. See extraction-darija.ts for the notes on
//  durations and narration lines.
// ─────────────────────────────────────────────────────────────────────────────
import type { VideoContent } from "../schema";
import { clinic } from "./clinic";

export const dentManquanteDarija: VideoContent = {
  ...clinic,

  // Solutions, not mistakes: turquoise ✓ on each scene.
  tipStyle: "option",

  intro: {
    kicker: "نصيحة من طبيب الأسنان",
    bigNumber: "3",
    title: "حلول باش تعوض سنة ناقصة",
    subtitle: "ما تخليش البلاصة خاوية",
    icon: "missingTooth",
    subtitles: ["طاحت ليك شي سنة؟", "عندك تلاتة د الحلول باش تعوضها."],
    durationInFrames: 135,
  },

  tips: [
    {
      label: "الحل 1",
      title: "الزرعة",
      icon: "implant",
      explanation: "جدر صناعي كيتحط فالعظم، ومن فوقو سنة جديدة.",
      goodPracticeLabel: "المزايا",
      goodPractice: "ثابتة وطبيعية، وما كتمسش السنان اللي حداها",
      subtitles: ["الحل الأول: الزرعة.", "ثابتة وطبيعية بحال سنتك."],
      durationInFrames: 210,
    },
    {
      label: "الحل 2",
      title: "الجسر الثابت",
      icon: "bridge",
      explanation: "سنة جديدة كتشد فالسنان اللي حداها.",
      goodPracticeLabel: "معلومة",
      goodPractice: "حل سريع، ولكن خاص نحكو شوية من السنان اللي حداها",
      subtitles: ["الحل الثاني: الجسر.", "كيتشد فالسنان اللي حداها."],
      durationInFrames: 210,
    },
    {
      label: "الحل 3",
      title: "الطقم المتحرك",
      icon: "denture",
      explanation: "سنان صناعية كتركبها وكتحيدها بوحدك.",
      goodPracticeLabel: "معلومة",
      goodPractice: "الحل الاقتصادي، ولكن أقل ثبات",
      subtitles: ["الحل الثالث: الطقم المتحرك.", "حل اقتصادي، كتركبو وكتحيدو بوحدك."],
      durationInFrames: 210,
    },
  ],

  outro: {
    title: "علاش خاصك تعوضها؟",
    checklist: [
      { icon: "shift", text: "السنان اللي حداها كيتحركو" },
      { icon: "bone", text: "العظم كينقص مع الوقت" },
      { icon: "tooth", text: "المضغ والضحكة كيتأثرو" },
    ],
    warning: "شنو هو الحل المناسب ليك؟ الفحص هو اللي كيحدد.",
    cta: "تابعنا باش توصلك نصائح أخرى",
    disclaimer: "محتوى توعوي، ما كيعوضش الاستشارة عند طبيب الأسنان.",
    subtitles: [
      "ما تخليش البلاصة خاوية، السنان كيتحركو.",
      "دوز عندنا نختارو معاك الحل المناسب.",
    ],
    durationInFrames: 195,
  },
};
