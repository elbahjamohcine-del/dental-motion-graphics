import type { VideoContent } from "../schema";
import { extractionDarija } from "./extraction-darija";

// Register every video here. Each entry creates a video composition
// (`id`) and a cover image composition (`id-Cover`) in Remotion Studio.
// Composition ids may only contain letters, numbers and dashes. The id is
// also the voice-over folder name: public/voiceover/<id>/.
export const videos: { id: string; content: VideoContent }[] = [
  { id: "ExtractionDarija", content: extractionDarija },
];
