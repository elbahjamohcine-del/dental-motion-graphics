// Fonts are bundled from npm (@fontsource), so rendering never depends on
// Google Fonts being reachable from the cloud machine.
import "@fontsource/cairo/600.css";
import "@fontsource/cairo/700.css";
import "@fontsource/cairo/800.css";
import "@fontsource/tajawal/400.css";
import "@fontsource/tajawal/500.css";
import "@fontsource/tajawal/700.css";
import { continueRender, delayRender } from "remotion";

const handle = delayRender("Loading fonts");

// The sample text makes the browser fetch both the Arabic and Latin subsets.
Promise.all(
  [
    "600 40px Cairo",
    "700 40px Cairo",
    "800 40px Cairo",
    "400 40px Tajawal",
    "500 40px Tajawal",
    "700 40px Tajawal",
  ].map((font) => document.fonts.load(font, "ضرسة غلطة Aa 0123")),
)
  .catch((err) => console.warn("Font loading failed", err))
  .finally(() => continueRender(handle));
