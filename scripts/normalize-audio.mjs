// Normalizes the audio of a rendered MP4 to the loudness social networks
// expect (-14 LUFS, true peak -1.5 dB). The video stream is copied untouched.
// Usage: node scripts/normalize-audio.mjs out/video.mp4   (needs ffmpeg)
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";

const file = process.argv[2];
if (!file || !fs.existsSync(file)) {
  console.error("Usage: node scripts/normalize-audio.mjs <video.mp4>");
  process.exit(1);
}
try {
  execFileSync("ffmpeg", ["-version"], { stdio: "ignore" });
} catch {
  console.warn("⚠ ffmpeg not found: audio loudness left as rendered");
  process.exit(0);
}

const TARGET = "I=-14:TP=-1.5:LRA=11";

// Pass 1: measure (ffmpeg prints the JSON report on stderr).
const report = spawnSync(
  "ffmpeg",
  ["-hide_banner", "-i", file, "-vn", "-af", `loudnorm=${TARGET}:print_format=json`, "-f", "null", "-"],
  { encoding: "utf8" },
).stderr;
const stats = JSON.parse(report.slice(report.lastIndexOf("{"), report.lastIndexOf("}") + 1));

// Pass 2: apply a linear gain based on the measurement.
const tmp = file.replace(/\.mp4$/, ".tmp.mp4");
execFileSync("ffmpeg", [
  "-loglevel", "error", "-y", "-i", file,
  "-af",
  `loudnorm=${TARGET}:measured_I=${stats.input_i}:measured_TP=${stats.input_tp}` +
    `:measured_LRA=${stats.input_lra}:measured_thresh=${stats.input_thresh}` +
    `:offset=${stats.target_offset}:linear=true,aresample=48000`,
  "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", tmp,
]);
fs.renameSync(tmp, file);
console.log(`✔ ${file}: audio ${stats.input_i} LUFS → -14 LUFS`);
