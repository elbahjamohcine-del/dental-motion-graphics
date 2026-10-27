// ─────────────────────────────────────────────────────────────────────────────
//  VIDEO: « 3 erreurs à éviter après une extraction dentaire »
//
//  All texts and timings of the video live here. Edit them freely:
//  durations are in frames (30 frames = 1 second). The total length is
//  computed automatically: sum(durations) - transitions × (scenes - 1).
//  135 + 3 × 210 + 195 - 4 × 15 = 900 frames = 30 s
// ─────────────────────────────────────────────────────────────────────────────
import type { VideoContent } from "../schema";
import { defaultColors } from "../theme";

export const extractionTroisErreurs: VideoContent = {
  brand: {
    name: "Votre Cabinet Dentaire",
    handle: "@votrecabinetdentaire",
  },

  intro: {
    kicker: "Conseil dentaire",
    bigNumber: "3",
    title: "erreurs à éviter",
    subtitle: "après une extraction dentaire",
    icon: "tooth",
    subtitles: [
      "Vous venez de vous faire retirer une dent ?",
      "Évitez ces 3 erreurs pour bien cicatriser.",
    ],
    durationInFrames: 135,
  },

  tips: [
    {
      label: "Erreur n°1",
      title: "Cracher ou rincer fort",
      icon: "rinse",
      explanation: "Le caillot sanguin protège la plaie : il ne faut pas le déloger.",
      goodPracticeLabel: "Le bon réflexe",
      goodPractice: "Pas de bain de bouche les 24 premières heures",
      subtitles: [
        "Première erreur : cracher ou se rincer énergiquement.",
        "Le caillot qui se forme protège la plaie.",
        "Attendez 24 heures avant tout rinçage doux.",
      ],
      durationInFrames: 210,
    },
    {
      label: "Erreur n°2",
      title: "Fumer ou boire à la paille",
      icon: "cigarette",
      explanation: "L’aspiration peut arracher le caillot et provoquer une alvéolite.",
      goodPracticeLabel: "Le bon réflexe",
      goodPractice: "Ni tabac ni paille pendant au moins 72 heures",
      subtitles: [
        "Deuxième erreur : fumer ou boire à la paille.",
        "L’aspiration peut déloger le caillot.",
        "Risque : une alvéolite, très douloureuse.",
      ],
      durationInFrames: 210,
    },
    {
      label: "Erreur n°3",
      title: "Manger chaud, dur ou croquant",
      icon: "hotFood",
      explanation: "La chaleur et la mastication irritent la zone qui cicatrise.",
      goodPracticeLabel: "Le bon réflexe",
      goodPractice: "Aliments tièdes et mous, mâchez de l’autre côté",
      subtitles: [
        "Troisième erreur : manger chaud, dur ou croquant.",
        "Préférez des aliments tièdes et mous.",
        "Et mâchez du côté opposé à l’extraction.",
      ],
      durationInFrames: 210,
    },
  ],

  outro: {
    title: "Les bons réflexes",
    checklist: [
      { icon: "gauze", text: "Mordre sur une compresse 30 min" },
      { icon: "ice", text: "Froid sur la joue, par intervalles" },
      { icon: "toothbrush", text: "Brossage doux, en évitant la plaie" },
    ],
    warning: "Douleur intense ou saignement persistant ? Contactez votre dentiste.",
    cta: "Abonnez-vous pour plus de conseils",
    disclaimer: "Contenu éducatif. Ne remplace pas l’avis de votre dentiste.",
    subtitles: [
      "Compresse, froid et douceur : vos meilleurs alliés.",
      "En cas de doute, contactez votre dentiste.",
    ],
    durationInFrames: 195,
  },

  transitionDurationInFrames: 15,
  showSubtitles: true,
  theme: defaultColors,
};
