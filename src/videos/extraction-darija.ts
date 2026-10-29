// ─────────────────────────────────────────────────────────────────────────────
//  VIDEO: « 3 غلطات ما خاصكش تديرهم من بعد ما تقلع الضرسة »
//  (3 erreurs à éviter après une extraction dentaire, en darija marocaine)
//
//  All texts and timings of the video live here. Edit them freely.
//  • Durations are in frames (30 frames = 1 second). A scene gets longer
//    automatically if its voice-over needs more time.
//    Without voice: 135 + 3 × 210 + 195 - 4 × 15 = 900 frames = 30 s
//  • `subtitles` = the narration: each line is spoken by the voice-over and
//    shown as a subtitle. Write numbers as words there ("تلاتة", not "3"),
//    so the AI voice pronounces them in Darija.
//  • After changing a narration line, regenerate the voice-over
//    (see README → Voice-over). Until then that line plays without voice.
// ─────────────────────────────────────────────────────────────────────────────
import type { VideoContent } from "../schema";
import { clinic } from "./clinic";

export const extractionDarija: VideoContent = {
  ...clinic,

  // "mistake": red ✕ on each tip. "option": turquoise ✓ (solutions, choices).
  tipStyle: "mistake",

  intro: {
    kicker: "نصيحة من طبيب الأسنان",
    bigNumber: "3",
    title: "غلطات ما خاصكش تديرهم",
    subtitle: "من بعد ما تقلع الضرسة",
    icon: "tooth",
    subtitles: ["قلعتي شي ضرسة؟", "رد البال من هاد الغلطات."],
    durationInFrames: 135,
  },

  tips: [
    {
      label: "الغلطة 1",
      title: "تبزق ولا تمضمض بالجهد",
      icon: "rinse",
      explanation: "الدم اللي كيتجمد فبلاصة الضرسة هو اللي كيحمي الجرح.",
      goodPracticeLabel: "الصواب",
      goodPractice: "ما تمضمضش حتى يدوز 24 ساعة",
      subtitles: [
        "الغلطة الأولى: تبزق ولا تمضمض بالجهد.",
        "الدم المتجمد هو اللي كيحمي الجرح.",
      ],
      durationInFrames: 210,
    },
    {
      label: "الغلطة 2",
      title: "تكمي ولا تشرب بلاپاي",
      icon: "cigarette",
      explanation: "الجبدة كتقدر تحيد الدم المتجمد وتجيب التهاب كيضر بزاف.",
      goodPracticeLabel: "الصواب",
      goodPractice: "لا كارو لا لاپاي، على الأقل 3 أيام",
      subtitles: [
        "الغلطة الثانية: الكارو ولا لاپاي.",
        "الجبدة كتحيد الدم المتجمد.",
      ],
      durationInFrames: 210,
    },
    {
      label: "الغلطة 3",
      title: "تاكل شي حاجة سخونة ولا قاصحة",
      icon: "hotFood",
      explanation: "السخانة والمضغ كيقلقو الجرح اللي باقي كيبرا.",
      goodPracticeLabel: "الصواب",
      goodPractice: "ماكلة فاترة ورطبة، ومضغ من الجهة الخرا",
      subtitles: [
        "الغلطة الثالثة: الماكلة السخونة ولا القاصحة.",
        "كول حاجة فاترة ورطبة.",
      ],
      durationInFrames: 210,
    },
  ],

  outro: {
    title: "شنو خاصك دير؟",
    checklist: [
      { icon: "gauze", text: "عض على الكومبريس نص ساعة" },
      { icon: "ice", text: "حط الثلج على الحنك من برا، شوية بشوية" },
      { icon: "toothbrush", text: "غسل سنانك بشوية وبعد من الجرح" },
    ],
    warning: "وجع قوي ولا الدم ما بغاش يحبس؟ تاصل بطبيب الأسنان ديالك.",
    cta: "تابعنا باش توصلك نصائح أخرى",
    disclaimer: "محتوى توعوي، ما كيعوضش الاستشارة عند طبيب الأسنان.",
    subtitles: [
      "كومبريس، ثلج، وشوية ديال الصبر.",
      "وإلا كان الوجع قوي، تاصل بطبيبك.",
    ],
    durationInFrames: 195,
  },
};
