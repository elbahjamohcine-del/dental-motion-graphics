// ─────────────────────────────────────────────────────────────────────────────
//  VIDEO: « ضرستك كتضرك فالليل؟ 3 حوايج باش يهدن الوجع »
//  (Mal de dents la nuit : 3 gestes en attendant le dentiste, en darija)
//
//  Texts and timings of this video. Shared settings (presenter, voice, music,
//  colors…) come from clinic.ts. See extraction-darija.ts for the notes on
//  durations and narration lines.
// ─────────────────────────────────────────────────────────────────────────────
import type { VideoContent } from "../schema";
import { clinic } from "./clinic";

export const toothacheNightDarija: VideoContent = {
  ...clinic,

  // Good gestures: turquoise ✓ on each scene.
  tipStyle: "option",

  intro: {
    kicker: "نصيحة من طبيب الأسنان",
    bigNumber: "3",
    title: "حوايج باش يهدن الوجع",
    subtitle: "حتى توصل عند طبيب الأسنان",
    icon: "tooth",
    subtitles: ["ضرستك كتضرك فالليل؟", "هاد تلاتة د الحوايج غادي يعاونوك."],
    durationInFrames: 135,
  },

  tips: [
    {
      label: "نصيحة 1",
      title: "مسكن للوجع",
      icon: "pill",
      explanation: "دوا بحال الباراسيطامول، حسب الجرعة اللي فالنوطيس.",
      goodPracticeLabel: "رد البال",
      goodPractice: "ما تحطش الأسبرين على السنة، كيحرق اللثة",
      subtitles: ["أولا: خود مسكن بحال الباراسيطامول.", "واحترم الجرعة اللي مكتوبة فالنوطيس."],
      durationInFrames: 210,
    },
    {
      label: "نصيحة 2",
      title: "البارد من برا",
      icon: "ice",
      explanation: "كومبريس بارد على الحنك، عشر دقايق وحيدو.",
      goodPracticeLabel: "رد البال",
      goodPractice: "ما تحطش السخون، كيزيد فالانتفاخ",
      subtitles: ["ثانيا: حط شي حاجة باردة على الحنك من برا.", "وما تحطش السخون، كيزيد فالانتفاخ."],
      durationInFrames: 210,
    },
    {
      label: "نصيحة 3",
      title: "نعس وراسك مرفوع",
      icon: "pillow",
      explanation: "مخدة زايدة كتنقص الضغط على السنة.",
      goodPracticeLabel: "زيد",
      goodPractice: "تمضمض بشوية بالما الفاتر والملحة",
      subtitles: ["ثالثا: نعس وراسك مرفوع على مخدة زايدة.", "وتمضمض بالما الفاتر والملحة."],
      durationInFrames: 210,
    },
  ],

  outro: {
    title: "إمتى خاصك تجي دغيا؟",
    checklist: [
      { icon: "warning", text: "الوجه ولا اللثة نفخو" },
      { icon: "thermometer", text: "عندك السخانة" },
      { icon: "pill", text: "المسكن ما بقاش كيهدن الوجع" },
    ],
    warning: "صعيب عليك تبلع ولا تتنفس؟ سير للمستعجلات فالحين.",
    // \u2066…\u2069 keep the phone number in reading order inside RTL text.
    cta: "عيط لينا: \u206606 21 40 66 21\u2069",
    disclaimer: "محتوى توعوي، ما كيعوضش الاستشارة عند طبيب الأسنان.",
    subtitles: ["إلا نفخ الوجه ولا عندك السخانة، ما تسناش.", "عيط لينا وجي فأقرب وقت."],
    durationInFrames: 195,
  },
};
