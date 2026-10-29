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
import { execFileSync, spawnSync } from "node:child_process";
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

// All pauses of at least 0.2 s, with the start/end of speech in the file.
const analyse = () => {
  const out = spawnSync(
    "ffmpeg",
    ["-hide_banner", "-i", input!, "-af", "highpass=f=80,silencedetect=noise=-35dB:d=0.2", "-f", "null", "-"],
    { encoding: "utf8" },
  ).stderr;
  const [h, m, sec] = (/Duration: (\d+):(\d+):([\d.]+)/.exec(out) ?? []).slice(1).map(Number);
  const duration = h * 3600 + m * 60 + sec;
  const starts = [...out.matchAll(/silence_start: ([\d.]+)/g)].map((x) => Number(x[1]));
  const ends = [...out.matchAll(/silence_end: ([\d.]+)/g)].map((x) => Number(x[1]));
  const pauses = starts.map((start, i) => ({ start, end: ends[i] ?? duration }));
  // Silence at the very beginning / end of the file is not a pause between lines.
  const speechStart = pauses[0]?.start === 0 ? pauses[0].end : 0;
  const speechEnd = pauses.at(-1) && pauses.at(-1)!.end >= duration - 0.01 ? pauses.at(-1)!.start : duration;
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
