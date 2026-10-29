// Cuts ONE recording of the whole narration into one clip per line, using
// the pauses between lines, and saves them as voice-over recordings:
//   public/voiceover/<videoId>/recordings/<line>.mp3
// Then run `npm run voiceover` to use them (recordings replace the AI voice).
//
//   npm run voiceover:split -- path/to/recording.m4a [--video=ExtractionDarija]
//
// Read the lines in order with a clear pause (about 1–2 s) between them.
// Each clip is cleaned: low rumble filtered, silences trimmed, level evened.
// Needs ffmpeg.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { videos } from "../src/videos";
import { getVoiceLines } from "../src/voiceover";

const root = path.resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);
const input = args.find((a) => !a.startsWith("--"));
const videoId = args.find((a) => a.startsWith("--video="))?.split("=")[1] ?? videos[0].id;

const fail = (message: string): never => {
  console.error(`✘ ${message}`);
  process.exit(1);
};

if (!input || !fs.existsSync(input)) {
  fail("Usage: npm run voiceover:split -- <recording file> [--video=<id>]");
}
const video = videos.find((v) => v.id === videoId) ?? fail(`Unknown video id ${videoId}`);
const lines = getVoiceLines(video.content);

// Pauses, measured on the average loudness of 50 ms windows (more robust than
// peak-based silence detection with phone recordings and room noise). The
// threshold adapts to the recording: between the room noise and the voice.
const analyse = () => {
  const rate = 8000;
  const pcm = execFileSync(
    "ffmpeg",
    ["-loglevel", "error", "-i", input!, "-af", "highpass=f=80", "-ac", "1", "-ar", String(rate), "-f", "s16le", "-"],
    { maxBuffer: 1024 * 1024 * 1024 },
  );
  const samples = new Int16Array(pcm.buffer, pcm.byteOffset, Math.floor(pcm.length / 2));
  const win = rate * 0.05;
  const levels: number[] = [];
  for (let i = 0; i + win <= samples.length; i += win) {
    let sum = 0;
    for (let j = i; j < i + win; j++) sum += (samples[j] / 32768) ** 2;
    levels.push(20 * Math.log10(Math.sqrt(sum / win) + 1e-9));
  }
  const sorted = [...levels].sort((a, b) => a - b);
  const noise = sorted[Math.floor(sorted.length * 0.1)];
  const voice = sorted[Math.floor(sorted.length * 0.9)];
  const threshold = noise + (voice - noise) * 0.3;

  const pauses: { start: number; end: number }[] = [];
  for (let i = 0; i < levels.length; ) {
    if (levels[i] >= threshold) {
      i++;
      continue;
    }
    let j = i;
    while (j < levels.length && levels[j] < threshold) j++;
    pauses.push({ start: i * 0.05, end: j * 0.05 });
    i = j;
  }
  const duration = levels.length * 0.05;
  const speechStart = pauses[0]?.start === 0 ? pauses[0].end : 0;
  const last = pauses.at(-1);
  const speechEnd = last && last.end >= duration - 0.05 ? last.start : duration;
  const inner = pauses.filter((p) => p.start > speechStart && p.end < speechEnd);
  return { speechStart, speechEnd, inner };
};

// The pauses between lines are the longest ones: keep the (lines - 1) longest.
const { speechStart, speechEnd, inner } = analyse();
if (inner.length < lines.length - 1) {
  fail(
    `Only ${inner.length + 1} spoken parts found for ${lines.length} lines. ` +
      "Leave a clear pause (1–2 s) between lines, then retry.",
  );
}
const byLength = [...inner].sort((a, b) => b.end - b.start - (a.end - a.start));
const boundaries = byLength.slice(0, lines.length - 1).sort((a, b) => a.start - b.start);
const shortestBetween = Math.min(...boundaries.map((p) => p.end - p.start));
const longestInside = Math.max(0, ...byLength.slice(lines.length - 1).map((p) => p.end - p.start));
if (shortestBetween < 0.45 || shortestBetween < longestInside * 1.3) {
  console.warn(
    `⚠ The pauses between lines (${shortestBetween.toFixed(2)} s) are not much longer than ` +
      `pauses inside lines (${longestInside.toFixed(2)} s): check the result.`,
  );
}
const segments: [number, number][] = [];
let cursor = speechStart;
for (const pause of boundaries) {
  segments.push([cursor, pause.start]);
  cursor = pause.end;
}
segments.push([cursor, speechEnd]);

const outDir = path.join(root, "public", "voiceover", videoId, "recordings");
fs.mkdirSync(outDir, { recursive: true });

console.log(`\n${videoId}: ${lines.length} lines found\n`);
segments.forEach(([start, end], i) => {
  const line = lines[i];
  const from = Math.max(0, start - 0.08);
  const length = end - start + 0.16;
  execFileSync("ffmpeg", [
    "-loglevel", "error", "-y", "-ss", from.toFixed(3), "-t", length.toFixed(3), "-i", input!,
    "-af", "highpass=f=80,afade=t=in:d=0.03,loudnorm=I=-18:TP=-2:LRA=7,afade=t=out:st=" +
      Math.max(0, length - 0.05).toFixed(3) + ":d=0.05",
    "-ar", "44100", "-ac", "1", "-c:a", "libmp3lame", "-q:a", "2",
    path.join(outDir, `${line.key}.mp3`),
  ]);
  console.log(`  ${String(i + 1).padStart(2)}. ${line.key.padEnd(8)} ${length.toFixed(2)} s  «${line.text}»`);
});
console.log(`\nSaved in public/voiceover/${videoId}/recordings/. Now run: npm run voiceover`);
