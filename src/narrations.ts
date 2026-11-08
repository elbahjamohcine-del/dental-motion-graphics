// Every video's narration lines and voice settings, whatever its format.
// Used by the voice-over scripts (generate-voiceover, split-recording).
import { storyVoiceLines } from "./story/voice";
import { stories, videos } from "./videos";
import { getVoiceLines } from "./voiceover";

export const narrations = [
  ...videos.map(({ id, content }) => ({
    id,
    voiceover: content.voiceover,
    lines: getVoiceLines(content),
  })),
  ...stories.map(({ id, content }) => ({
    id,
    voiceover: content.voiceover,
    lines: storyVoiceLines(content),
  })),
];
