import type { VideoContent } from "../schema";
import type { StoryContent } from "../story/schema";
import { carieDarija } from "./carie-darija";
import { dentManquanteDarija } from "./dent-manquante-darija";
import { extractionDarija } from "./extraction-darija";

// Register every video here. Each entry creates a video composition
// (`id`) and a cover image composition (`id-Cover`) in Remotion Studio.
// Composition ids may only contain letters, numbers and dashes. The id is
// also the voice-over folder name: public/voiceover/<id>/.
export const videos: { id: string; content: VideoContent }[] = [
  { id: "ExtractionDarija", content: extractionDarija },
  { id: "DentManquanteDarija", content: dentManquanteDarija },
];

// Story reels (full-screen scenes, voice in one language, subtitles in
// another). Same id rules as above.
export const stories: { id: string; content: StoryContent }[] = [
  { id: "CarieDarija", content: carieDarija },
];
