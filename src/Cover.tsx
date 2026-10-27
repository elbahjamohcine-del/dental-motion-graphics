import React from "react";
import { Freeze } from "remotion";
import "./fonts";
import { ThemeProvider } from "./components/ThemeContext";
import { IntroScene } from "./scenes/IntroScene";
import type { VideoContent } from "./schema";

// Cover image (thumbnail): the intro scene, frozen once fully animated.
export const Cover: React.FC<VideoContent> = (content) => (
  <ThemeProvider colors={content.theme}>
    <Freeze frame={100}>
      <IntroScene content={content.intro} />
    </Freeze>
  </ThemeProvider>
);
