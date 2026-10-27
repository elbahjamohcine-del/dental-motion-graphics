// Regenerates the README previews in docs/ from a rendered MP4.
// Usage: npm run render && npm run preview:docs
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { root } from "./shared.mjs";

const input = path.join(root, process.argv[2] ?? "out/extraction-3-erreurs.mp4");
const docs = path.join(root, "docs");
if (!fs.existsSync(input)) {
  console.error(`Missing ${input}. Run "npm run render" first.`);
  process.exit(1);
}
fs.mkdirSync(docs, { recursive: true });

const ffmpeg = (...args) => execFileSync("ffmpeg", ["-loglevel", "error", "-y", ...args]);

// Animated GIF (12 fps, 320 px wide, optimised palette).
ffmpeg(
  "-i", input,
  "-vf",
  "fps=12,scale=320:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=96[p];[b][p]paletteuse=dither=bayer:bayer_scale=4",
  path.join(docs, "preview.gif"),
);

// Storyboard: one frame per scene.
const frames = [100, 230, 440, 650, 890];
const select = frames.map((f) => `eq(n\\,${f})`).join("+");
ffmpeg(
  "-i", input,
  "-vf", `select='${select}',scale=360:-1,tile=${frames.length}x1:padding=12:color=white`,
  "-frames:v", "1",
  path.join(docs, "storyboard.jpg"),
);
// Cover thumbnail (from "npm run still"), if available.
const cover = path.join(root, "out/extraction-3-erreurs-cover.png");
if (fs.existsSync(cover)) {
  ffmpeg("-i", cover, "-vf", "scale=540:-1", "-q:v", "3", path.join(docs, "cover.jpg"));
}
console.log("✔ previews updated in docs/");
