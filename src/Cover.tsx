import React from "react";
import { Sequence } from "remotion";
import "./fonts";
import { ThemeProvider } from "./components/ThemeContext";
import { IntroScene } from "./scenes/IntroScene";
import type { VideoContent } from "./schema";

// Frame of the intro shown on the cover, once everything has animated in.
const COVER_FRAME = 100;

// Cover image (thumbnail): the intro scene as it looks at COVER_FRAME.
// A negative `from` shifts time forward (<Freeze> would be clamped to frame 0
// inside a 1-frame <Still>).
export const Cover: React.FC<VideoContent> = (content) => (
  <ThemeProvider colors={content.theme} direction={content.direction}>
    <Sequence from={-COVER_FRAME}>
      <IntroScene content={content.intro} presenter={content.presenter} />
    </Sequence>
  </ThemeProvider>
);
