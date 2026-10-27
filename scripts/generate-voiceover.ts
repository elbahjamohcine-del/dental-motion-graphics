// Generates the voice-over: one MP3 per narration line, listed in
// public/voiceover/manifest.json (read by the video at render time).
//
//   npm run voiceover               ElevenLabs (needs ELEVENLABS_API_KEY)
//   npm run voiceover -- --mock     placeholder tones, to test timings for free
//   npm run voiceover -- --force    regenerate every line
//
// Per line, the source is chosen in this order:
//   1. your own recording: public/voiceover/<videoId>/recordings/<line>.(mp3|wav|m4a)
//   2. ElevenLabs (or a mock tone with --mock)
// Lines whose text, voice and settings did not change are not regenerated.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { videos } from "../src/videos";
import {
  getVoiceLines,
  MANIFEST_PATH,
  type ManifestEntry,
  type VoiceManifest,
} from "../src/voiceover";

const root = path.resolve(import.meta.dirname, "..");
const publicDir = path.join(root, "public");
const manifestFile = path.join(publicDir, MANIFEST_PATH);
const remotionBin = path.join(root, "node_modules", ".bin", "remotion");

const args = process.argv.slice(2);
const mock = args.includes("--mock");
const force = args.includes("--force");
const onlyVideo = args.find((a) => a.startsWith("--video="))?.split("=")[1];

const apiKey = process.env.ELEVENLABS_API_KEY;

// Duration of an audio file, using the ffprobe binary shipped with Remotion.
const durationOf = (file: string): number => {
  const out = execFileSync(
    remotionBin,
    ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file],
    { encoding: "utf8" },
  );
  const seconds = parseFloat(out.trim());
  if (!Number.isFinite(seconds) || seconds <= 0) {
    throw new Error(`Could not read the duration of ${file}`);
  }
  return seconds;
};

const elevenLabs = async (
  text: string,
  voiceId: string,
  settings: (typeof videos)[number]["content"]["voiceover"],
): Promise<Buffer> => {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey!,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: process.env.ELEVENLABS_MODEL_ID || settings.modelId,
        voice_settings: {
          stability: settings.stability,
          similarity_boost: settings.similarityBoost,
          style: settings.style,
          use_speaker_boost: true,
          speed: settings.speed,
        },
      }),
    },
  );
  if (!res.ok) {
    throw new Error(`ElevenLabs error ${res.status}: ${await res.text()}`);
  }
  return Buffer.from(await res.arrayBuffer());
};

// Placeholder: a soft tone lasting roughly as long as the line would be spoken.
const mockAudio = (text: string, output: string) => {
  const words = text.split(/\s+/).length;
  const seconds = (0.42 * words + 0.3).toFixed(2);
  execFileSync("ffmpeg", [
    "-loglevel", "error", "-y",
    "-f", "lavfi", "-i", `sine=frequency=330:duration=${seconds}`,
    "-af", `volume=0.15,afade=t=in:d=0.1,afade=t=out:st=${Number(seconds) - 0.2}:d=0.2`,
    "-c:a", "libmp3lame", "-b:a", "64k", output,
  ]);
};

const findRecording = (videoId: string, key: string) => {
  const dir = path.join(publicDir, "voiceover", videoId, "recordings");
  return ["mp3", "wav", "m4a"]
    .map((ext) => path.join(dir, `${key}.${ext}`))
    .find((file) => fs.existsSync(file));
};

const main = async () => {
  const manifest: VoiceManifest = fs.existsSync(manifestFile)
    ? JSON.parse(fs.readFileSync(manifestFile, "utf8"))
    : {};

  for (const { id, content } of videos) {
    if (onlyVideo && id !== onlyVideo) continue;
    const settings = content.voiceover;
    const voiceId = process.env.ELEVENLABS_VOICE_ID || settings.voiceId;
    const modelId = process.env.ELEVENLABS_MODEL_ID || settings.modelId;
    const outDir = path.join(publicDir, "voiceover", id);
    fs.mkdirSync(outDir, { recursive: true });

    const previous = manifest[id] ?? {};
    const next: Record<string, ManifestEntry> = {};
    console.log(`\n${id}`);

    for (const line of getVoiceLines(content)) {
      const recording = findRecording(id, line.key);
      if (recording) {
        next[line.key] = {
          file: path.relative(publicDir, recording).split(path.sep).join("/"),
          text: line.text,
          durationInSeconds: durationOf(recording),
          provider: "recording",
        };
        console.log(`  🎙  ${line.key}  (your recording)`);
        continue;
      }

      const provider = mock ? "mock" : "elevenlabs";
      // The file name changes whenever the text, voice or settings change.
      const hash = createHash("sha1")
        .update(JSON.stringify([provider, line.text, voiceId, modelId, settings.stability,
          settings.similarityBoost, settings.style, settings.speed]))
        .digest("hex")
        .slice(0, 10);
      const relFile = `voiceover/${id}/${line.key}-${hash}.mp3`;
      const absFile = path.join(publicDir, relFile);

      const cached = previous[line.key];
      if (!force && cached?.file === relFile && fs.existsSync(absFile)) {
        next[line.key] = cached;
        console.log(`  ✓  ${line.key}  (unchanged)`);
        continue;
      }

      if (mock) {
        mockAudio(line.text, absFile);
      } else {
        if (!apiKey) {
          throw new Error(
            "ELEVENLABS_API_KEY is not set. Add it as an environment variable " +
              "(or GitHub secret), or use --mock to test without a voice.",
          );
        }
        if (!voiceId) {
          throw new Error(
            "No ElevenLabs voice selected. Set voiceover.voiceId in the video " +
              "content file or the ELEVENLABS_VOICE_ID variable (see README).",
          );
        }
        fs.writeFileSync(absFile, await elevenLabs(line.text, voiceId, settings));
      }

      next[line.key] = {
        file: relFile,
        text: line.text,
        durationInSeconds: durationOf(absFile),
        provider,
        ...(mock ? {} : { voiceId, modelId }),
      };
      console.log(`  ＋ ${line.key}  ${next[line.key].durationInSeconds.toFixed(2)} s  «${line.text}»`);
    }

    // Remove generated files that are no longer used (recordings are kept).
    const used = new Set(Object.values(next).map((e) => path.join(publicDir, e.file)));
    for (const file of fs.readdirSync(outDir)) {
      const abs = path.join(outDir, file);
      if (file.endsWith(".mp3") && !used.has(abs)) fs.rmSync(abs);
    }

    manifest[id] = next;
    const total = Object.values(next).reduce((s, e) => s + e.durationInSeconds, 0);
    console.log(`  → ${Object.keys(next).length} lines, ${total.toFixed(1)} s of narration`);
  }

  fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`\nManifest written: public/${MANIFEST_PATH}`);
};

main().catch((err) => {
  console.error(`\n✘ ${err.message}`);
  process.exit(1);
});
