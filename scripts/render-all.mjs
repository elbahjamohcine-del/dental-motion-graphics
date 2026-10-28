// Renders every registered video to out/<id>.mp4 and its cover to
// out/<id>-cover.png. Usage: npm run render:all
import { getCompositions, renderMedia, renderStill } from "@remotion/renderer";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { browserExecutable, bundleProject, isStill, root } from "./shared.mjs";

const serveUrl = await bundleProject();
const compositions = await getCompositions(serveUrl, { browserExecutable });

for (const composition of compositions) {
  if (isStill(composition)) {
    const output = path.join(root, "out", `${composition.id}.png`);
    await renderStill({ composition, serveUrl, output, browserExecutable });
    console.log(`✔ ${output}`);
    continue;
  }
  const output = path.join(root, "out", `${composition.id}.mp4`);
  let last = -1;
  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    crf: 18,
    pixelFormat: "yuv420p",
    colorSpace: "bt709",
    outputLocation: output,
    browserExecutable,
    chromiumOptions: { gl: "swangle" },
    onProgress: ({ progress }) => {
      const pct = Math.floor(progress * 10) * 10;
      if (pct !== last) {
        last = pct;
        console.log(`  ${composition.id}: ${pct}%`);
      }
    },
  });
  execFileSync("node", [path.join(root, "scripts/normalize-audio.mjs"), output], {
    stdio: "inherit",
  });
  console.log(`✔ ${output}`);
}
