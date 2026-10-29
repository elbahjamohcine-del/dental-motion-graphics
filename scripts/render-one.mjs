// Renders one video and its cover, then normalizes the audio.
// Usage: npm run render:video -- <CompositionId>
//   → out/<CompositionId>.mp4 and out/<CompositionId>-cover.png
import { execFileSync } from "node:child_process";

const id = process.argv[2];
if (!id) {
  console.error("Usage: npm run render:video -- <CompositionId>   (ids: see src/videos/index.ts)");
  process.exit(1);
}
const run = (cmd, args) => execFileSync(cmd, args, { stdio: "inherit" });
run("npx", ["remotion", "render", id, `out/${id}.mp4`]);
run("node", ["scripts/normalize-audio.mjs", `out/${id}.mp4`]);
run("npx", ["remotion", "still", `${id}-Cover`, `out/${id}-cover.png`]);
