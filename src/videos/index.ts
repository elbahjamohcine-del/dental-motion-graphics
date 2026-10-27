import type { VideoContent } from "../schema";
import { extractionTroisErreurs } from "./extraction-3-erreurs";

// Register every video here. Each entry creates a video composition
// (`id`) and a cover image composition (`id-Cover`) in Remotion Studio.
// Composition ids may only contain letters, numbers and dashes.
export const videos: { id: string; content: VideoContent }[] = [
  { id: "ExtractionTroisErreurs", content: extractionTroisErreurs },
];
