// Smoke test: bundles the project, validates every composition (props are
// checked against the zod schema) and renders key frames of each scene.
// Usage: npm test   (after typecheck + lint)
import { getCompositions, renderStill } from "@remotion/renderer";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { browserExecutable, bundleProject, isStill, root } from "./shared.mjs";

const outDir = path.join(root, "out", "test");
fs.mkdirSync(outDir, { recursive: true });

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
      assert.ok(fs.statSync(output).size > 10_000, `${id}: frame ${frame} looks empty`);
    }
    console.log(`  ✔ ${frames.length} frame(s) rendered`);
  } catch (err) {
    errors.push(err);
    console.error(`  ✘ ${err.message}`);
  }
}

// Expected length of the reference video (30 s Reel).
const main = compositions.find((c) => c.id === "ExtractionTroisErreurs");
if (main && main.durationInFrames !== 900) {
  errors.push(new Error(`ExtractionTroisErreurs must be 900 frames, got ${main.durationInFrames}`));
}

if (errors.length > 0) {
  console.error(`\n${errors.length} error(s)`);
  process.exit(1);
}
console.log(`\nAll good. Frames saved in ${path.relative(root, outDir)}/`);
