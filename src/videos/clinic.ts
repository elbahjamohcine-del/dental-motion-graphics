// ─────────────────────────────────────────────────────────────────────────────
//  Settings shared by every video of the clinic: presenter, brand, voice,
//  music, sound effects and colors. A video file only adds its own texts:
//    export const myVideo: VideoContent = { ...clinic, intro, tips, outro, … };
//  Any field can still be overridden in a video file.
// ─────────────────────────────────────────────────────────────────────────────
import type { VideoContent } from "../schema";
import { defaultColors } from "../theme";

export const clinic = {
  direction: "rtl",

  // Photo shown in the intro (with a name plate), in the corner of the tip
  // scenes and in the outro. Set photo to "" to show the tooth icon instead.
  presenter: {
    photo: "presenter/avatar.jpg",
    name: "Cabinet Dentaire ELBAHJA",
    title: "طبيب الأسنان · القنيطرة",
    fullImage: "presenter/avatar-full.jpg",
    // Lip-synced video of the outro (see README → Talking avatar).
    talkingVideo: "",
    // Where each outro line starts in the talking video (seconds).
    talkingVideoCuts: [],
    showInScenes: true,
  },

  brand: {
    name: "Cabinet Dentaire ELBAHJA · Kénitra",
    handle: "@Cabinet.dentaire.elbahja",
  },

  transitionDurationInFrames: 15,
  showSubtitles: true,

  voiceover: {
    enabled: true,
    // The presenter's own cloned voice ("my voice for dental education"),
    // used for lines without a recording. The ELEVENLABS_VOICE_ID variable
    // overrides it. See README.
    voiceId: "GYDWB17rHEmglJPt2JFA",
    modelId: "eleven_v4",
    stability: 0.5,
    similarityBoost: 0.75,
    style: 0.2,
    speed: 1,
    volume: 1,
    playbackRate: 1,
    gapInFrames: 4,
    // Spellings that help the AI voice pronounce Darija words. The subtitles
    // keep the normal word.
    pronunciations: {
      "تبزق": "تْبْزَقْ",
    },
  },

  // Background music (generated with ElevenLabs Music), quieter under the voice.
  music: {
    src: "music/calm-medical.mp3",
    volume: 0.55,
    duckedVolume: 0.2,
    fadeInFrames: 15,
    fadeOutFrames: 45,
  },

  sfx: {
    enabled: true,
    volume: 0.45,
    subtitleTicks: true,
  },

  theme: defaultColors,
} satisfies Omit<VideoContent, "intro" | "tips" | "outro" | "tipStyle">;
