import { staticFile } from "remotion";
import { MANIFEST_PATH, type VoiceManifest } from "./voiceover";

// Reads public/voiceover/manifest.json. No manifest = no voice-over.
export const loadVoiceManifest = async (): Promise<VoiceManifest> => {
  try {
    const res = await fetch(staticFile(MANIFEST_PATH));
    return res.ok ? ((await res.json()) as VoiceManifest) : {};
  } catch {
    return {};
  }
};
