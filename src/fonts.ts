// Fonts are bundled from npm (@fontsource), so rendering never depends on
// Google Fonts being reachable from the cloud machine.
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import { continueRender, delayRender } from "remotion";

const handle = delayRender("Loading fonts");

Promise.all(
  [
    "600 40px Montserrat",
    "700 40px Montserrat",
    "800 40px Montserrat",
    "400 40px Inter",
    "500 40px Inter",
    "600 40px Inter",
  ].map((font) => document.fonts.load(font, "AÉèàç0123")),
)
  .catch((err) => console.warn("Font loading failed", err))
  .finally(() => continueRender(handle));
