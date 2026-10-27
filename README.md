# Dental Motion Graphics 🦷

A [Remotion](https://www.remotion.dev) template project for **educational dental videos** in vertical format, ready to post on Instagram Reels and TikTok.

The first video is **« 3 erreurs à éviter après une extraction dentaire »**, a 30-second video in French.

| Preview | Cover |
| :---: | :---: |
| <img src="docs/preview.gif" width="270" alt="Animated preview" /> | <img src="docs/cover.jpg" width="270" alt="Cover image" /> |

![Storyboard](docs/storyboard.jpg)

## Specs

| | |
| --- | --- |
| Format | 1080 × 1920 (9:16), 30 FPS |
| Duration | 30 s (900 frames), computed automatically from the content |
| Output | MP4 H.264, `yuv420p`, BT.709, CRF 18 (~10 MB). No audio track: add music in Instagram / TikTok |
| Design | White, dark blue (`#0B2545`) and turquoise (`#14B8A6`); Montserrat + Inter fonts bundled locally |
| Animations | Word-by-word titles, self-drawing line icons, spring badges, slide / wipe / iris transitions, karaoke subtitles, story-style progress bar |
| Safe zones | Text stays clear of the areas covered by the Instagram/TikTok UI (top 200 px, bottom 380 px) |

## Quick start

```bash
npm install
npm run dev        # opens Remotion Studio at http://localhost:3000
npm run render     # → out/extraction-3-erreurs.mp4
npm run still      # → out/extraction-3-erreurs-cover.png (cover image)
```

Requires Node.js 20 or later (22 recommended, see `.nvmrc`). On first render Remotion downloads a headless Chrome automatically.

### All commands

| Command | Description |
| --- | --- |
| `npm run dev` | Remotion Studio: live preview, timeline, and text editing in the props panel |
| `npm run render` | Renders the main video to MP4 |
| `npm run still` | Renders the cover image (PNG) |
| `npm run render:all` | Renders **every** registered video plus its cover into `out/` |
| `npm test` | TypeScript check, ESLint, then a smoke test that validates the content and renders 13 key frames |
| `npm run preview:docs` | Regenerates `docs/preview.gif`, `docs/storyboard.jpg` and `docs/cover.jpg` from the rendered MP4 |

## Editing the text

All texts are in a single file: [`src/videos/extraction-3-erreurs.ts`](src/videos/extraction-3-erreurs.ts).

```ts
tips: [
  {
    label: "Erreur n°1",
    title: "Cracher ou rincer fort",
    icon: "rinse",
    explanation: "Le caillot sanguin protège la plaie : il ne faut pas le déloger.",
    goodPracticeLabel: "Le bon réflexe",
    goodPractice: "Pas de bain de bouche les 24 premières heures",
    subtitles: ["Première erreur : cracher ou se rincer énergiquement.", ...],
    durationInFrames: 210, // 7 s
  },
  ...
]
```

- **Brand**: `brand.name` and `brand.handle` (shown in the final call to action). Replace the placeholders `Votre Cabinet Dentaire` / `@votrecabinetdentaire`.
- **Subtitles**: each scene has a list of lines. They are spread over the scene in proportion to their length. Set `showSubtitles: false` to hide them.
- **Durations**: in frames (30 = 1 second). The total is `sum of scenes − transitions`. For this video that is `135 + 3×210 + 195 − 4×15 = 900`.
- **Colors**: `theme` (defaults in [`src/theme.ts`](src/theme.ts)).
- **French typography** is automatic: a non-breaking space is inserted before `? ! : ;`, so the punctuation mark never starts a line.

You can also edit everything visually in **Remotion Studio** (`npm run dev`) → *Props* panel on the right, then click *Render*. This is handy for quick tests. Edits made there are temporary, so copy the final text back into the content file.

### Available icons

`tooth`, `rinse`, `cigarette`, `straw`, `hotFood`, `ice`, `gauze`, `toothbrush`, `pill`, `phone`, `check`

To add one, add its SVG paths (200×200 grid) to [`src/icons/paths.ts`](src/icons/paths.ts) and its name to `iconNames` in [`src/schema.ts`](src/schema.ts).

## Creating a new video

1. Copy `src/videos/extraction-3-erreurs.ts` to e.g. `src/videos/brossage-5-conseils.ts` and change the texts. The number of `tips` is free: 1, 3, 5…
2. Register it in [`src/videos/index.ts`](src/videos/index.ts):
   ```ts
   import { brossageCinqConseils } from "./brossage-5-conseils";

   export const videos = [
     { id: "ExtractionTroisErreurs", content: extractionTroisErreurs },
     { id: "BrossageCinqConseils", content: brossageCinqConseils },
   ];
   ```
3. Render: `npx remotion render BrossageCinqConseils out/brossage.mp4` (or `npm run render:all`).

Each video automatically gets a `<id>-Cover` image composition.

## Project structure

```
src/
├── index.ts                  Remotion entry point
├── Root.tsx                  Registers a video + cover per entry in videos/index.ts
├── DentalReel.tsx            Generic engine: content → scenes, transitions, subtitles
├── Cover.tsx                 Cover image (intro, frozen)
├── schema.ts                 Zod schema of the content (validation + Studio form)
├── theme.ts                  Colors, fonts, safe zones
├── timeline.ts               Scene start times / total duration
├── typography.ts             French non-breaking spaces
├── fonts.ts                  Montserrat + Inter, bundled from npm
├── videos/                   ✏️  One content file per video
├── scenes/                   IntroScene, TipScene (reused per tip), OutroScene
├── components/               AnimatedTitle, IconBadge, InfoCard, Pill, Subtitles, ProgressBar, Background
└── icons/                    Self-drawing line icons
scripts/                      test, render-all, make-preview
.github/workflows/render.yml  Cloud rendering with GitHub Actions
```

## Rendering in the cloud

### GitHub Actions (built in)

The workflow [`.github/workflows/render.yml`](.github/workflows/render.yml) installs the project, runs the tests and renders the MP4 and cover image:

- **automatically** on every push to `main` that changes `src/`, the dependencies or the config;
- **manually**: *Actions* tab → *Render video* → *Run workflow*, then enter the composition id.

When the run finishes, download the video from the run's **Artifacts** section (kept for 30 days).

### Any Linux server / container

```bash
npm ci
npx remotion browser ensure   # downloads Chrome Headless Shell
npm test
npm run render
```

If the machine cannot download the browser (restricted network), point to a Chromium that is already installed:

```bash
REMOTION_BROWSER_EXECUTABLE=/path/to/chrome-headless-shell npm run render
```

`remotion.config.ts` already uses the `swangle` software renderer, so no GPU is required. Rendering 30 s takes about 3–4 minutes on 2 CPU cores. For faster renders at scale, see [Remotion Lambda](https://www.remotion.dev/docs/lambda).

## Medical content

The texts are general educational advice and do not replace a consultation. Every video ends with a disclaimer (`outro.disclaimer`). Have the content reviewed by the practitioner before publishing.

## License

Remotion is free for individuals and companies of up to 3 people. Larger companies need a [company license](https://www.remotion.dev/license).
