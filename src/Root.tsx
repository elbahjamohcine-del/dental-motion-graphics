import React from "react";
import { Composition, Still } from "remotion";
import { Cover } from "./Cover";
import { DentalReel } from "./DentalReel";
import { videoSchema } from "./schema";
import { VIDEO } from "./theme";
import { loadVoiceManifest } from "./loadManifest";
import { getTotalDuration } from "./timeline";
import { stories, videos } from "./videos";
import { storySchema } from "./story/schema";
import { StoryCover, StoryReel } from "./story/StoryReel";
import { applyStoryVoiceover, storyDuration } from "./story/voice";
import { applyVoiceover } from "./voiceover";

export const RemotionRoot: React.FC = () => (
  <>
    {videos.map(({ id, content }) => (
      <React.Fragment key={id}>
        <Composition
          id={id}
          component={DentalReel}
          schema={videoSchema}
          defaultProps={content}
          width={VIDEO.width}
          height={VIDEO.height}
          fps={VIDEO.fps}
          // Placeholder, replaced by calculateMetadata below.
          durationInFrames={1}
          calculateMetadata={async ({ props }) => {
            // Adds the voice-over clips and adapts scene durations to them.
            const manifest = await loadVoiceManifest();
            const resolved = applyVoiceover(props, manifest[id], VIDEO.fps);
            return {
              durationInFrames: getTotalDuration(resolved),
              props: resolved,
            };
          }}
        />
        <Still
          id={`${id}-Cover`}
          component={Cover}
          schema={videoSchema}
          defaultProps={content}
          width={VIDEO.width}
          height={VIDEO.height}
        />
      </React.Fragment>
    ))}
    {stories.map(({ id, content }) => (
      <React.Fragment key={id}>
        <Composition
          id={id}
          component={StoryReel}
          schema={storySchema}
          defaultProps={content}
          width={VIDEO.width}
          height={VIDEO.height}
          fps={VIDEO.fps}
          durationInFrames={1}
          calculateMetadata={async ({ props }) => {
            const manifest = await loadVoiceManifest();
            const resolved = applyStoryVoiceover(props, manifest[id], VIDEO.fps);
            return { durationInFrames: storyDuration(resolved), props: resolved };
          }}
        />
        <Still
          id={`${id}-Cover`}
          component={StoryCover}
          schema={storySchema}
          defaultProps={content}
          width={VIDEO.width}
          height={VIDEO.height}
        />
      </React.Fragment>
    ))}
  </>
);
