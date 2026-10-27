// Smoke test: bundles the project, validates every composition (props are
// checked against the zod schema) and renders key frames of each scene.
// Usage: npm test   (after typecheck + lint)
import { getCompositions, renderStill } from "@remotion/renderer";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { browserExecutable, bundleProject, isStill, root } from "./shared.mjs";

const outDir = path.join(root, "out", "test");
fs.mkdirSync(outDir, { recursive: true });

// Average edge density of an image (0 = completely flat, nothing drawn).
// Needs a system ffmpeg; the check is skipped if it is not installed.
const hasFfmpeg = (() => {
  try {
    execFileSync("ffmpeg", ["-version"], { stdio: "ignore" });
    return true;
  } catch {
    console.warn("⚠ ffmpeg not found: blank-frame detection skipped");
    return false;
  }
})();

const edgeDensity = (file) => {
  const out = execFileSync(
    "ffmpeg",
    [
      "-loglevel", "error", "-i", file,
      "-vf",
      "scale=270:-1,format=gray,edgedetect=low=0.1:high=0.3,signalstats," +
        "metadata=print:key=lavfi.signalstats.YAVG:file=-",
      "-f", "null", "-",
    ],
    { encoding: "utf8" },
  );
  return Number(/YAVG=([\d.]+)/.exec(out)?.[1] ?? 0);
};

const errors = [];
const serveUrl = await bundleProject();
const compositions = await getCompositions(serveUrl, { browserExecutable });
assert.ok(compositions.length > 0, "No composition registered");

for (const composition of compositions) {
  const { id, width, height, fps, durationInFrames } = composition;
  console.log(`• ${id}: ${width}x${height}, ${fps} fps, ${durationInFrames} frames`);
  try {
    assert.equal(width, 1080, `${id}: width must be 1080`);
    assert.equal(height, 1920, `${id}: height must be 1920`);

    let frames = [0];
    if (!isStill(composition)) {
      assert.equal(fps, 30, `${id}: fps must be 30`);
      assert.ok(durationInFrames <= 90 * 30, `${id}: longer than 90 s`);
      // Sample ~12 frames spread over the whole video, plus the last one.
      const step = Math.floor(durationInFrames / 12);
      frames = Array.from({ length: 12 }, (_, i) => i * step);
      frames.push(durationInFrames - 1);
    }

    for (const frame of frames) {
      const output = path.join(outDir, `${id}-${String(frame).padStart(4, "0")}.png`);
      await renderStill({ composition, serveUrl, frame, output, browserExecutable });
      // Frame 0 may legitimately be empty (animations start from nothing).
      if (hasFfmpeg && (frame > 0 || isStill(composition))) {
        const density = edgeDensity(output);
        assert.ok(density > 1, `${id}: frame ${frame} looks blank (edge density ${density})`);
      }
    }
    console.log(`  ✔ ${frames.length} frame(s) rendered`);
  } catch (err) {
    errors.push(err);
    console.error(`  ✘ ${err.message}`);
  }
}

// Reels / TikTok target: about 30 s. Scenes can grow with the voice-over.
for (const c of compositions.filter((c) => !isStill(c))) {
  const seconds = c.durationInFrames / c.fps;
  if (seconds > 35) {
    errors.push(new Error(`${c.id} is ${seconds.toFixed(1)} s: shorten the narration (target 30 s)`));
  }
}

// Voice-over: every clip in the manifest must exist; report missing lines.
const manifestFile = path.join(root, "public/voiceover/manifest.json");
const manifest = fs.existsSync(manifestFile)
  ? JSON.parse(fs.readFileSync(manifestFile, "utf8"))
  : {};
for (const c of compositions.filter((c) => !isStill(c))) {
  const entries = manifest[c.id] ?? {};
  for (const [key, entry] of Object.entries(entries)) {
    if (!fs.existsSync(path.join(root, "public", entry.file))) {
      errors.push(new Error(`${c.id}: voice clip ${key} missing (${entry.file})`));
    }
  }
  const clips = c.props.voiceClips?.length ?? 0;
  const providers = [...new Set(Object.values(entries).map((e) => e.provider))];
  console.log(
    `• ${c.id}: ${(c.durationInFrames / c.fps).toFixed(1)} s, ` +
      (clips > 0
        ? `voice-over ${clips} clip(s) [${providers.join(", ")}]`
        : "no voice-over (run npm run voiceover)"),
  );
}

if (errors.length > 0) {
  console.error(`\n${errors.length} error(s)`);
  process.exit(1);
}
console.log(`\nAll good. Frames saved in ${path.relative(root, outDir)}/`);
