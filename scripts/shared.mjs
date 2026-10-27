import { bundle } from "@remotion/bundler";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Optional pre-installed browser (see README "Rendering in the cloud").
export const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE || null;

export const bundleProject = () =>
  bundle({
    entryPoint: path.join(root, "src/index.ts"),
    onProgress: () => undefined,
  });

export const isStill = (composition) => composition.durationInFrames === 1;
