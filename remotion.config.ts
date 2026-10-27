// Global render settings. Applied to `remotion studio` and `remotion render`.
// See https://www.remotion.dev/docs/config
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(90);
Config.setCodec("h264");
Config.setCrf(18); // Higher quality than the default (lower = better)
Config.setPixelFormat("yuv420p"); // Maximum compatibility (Instagram, TikTok, iOS)
Config.setColorSpace("bt709"); // Standard HD color space, limited range
Config.setOverwriteOutput(true);

// Cloud containers usually have no GPU and limited /dev/shm.
Config.setChromiumOpenGlRenderer("swangle");

// Optional: use a pre-installed Chromium instead of downloading Chrome Headless Shell.
// e.g. REMOTION_BROWSER_EXECUTABLE=/usr/bin/chromium npm run render
if (process.env.REMOTION_BROWSER_EXECUTABLE) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER_EXECUTABLE);
}
