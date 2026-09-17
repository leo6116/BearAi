import type { JSONSchema } from "@/lib/anthropic";

export const SCRIPT_TOOL_SCHEMA: JSONSchema = {
  type: "object",
  properties: {
    storySummary: {
      type: "string",
      description: "A short 2-3 sentence synopsis of the overall script/storyline.",
    },
    scenes: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        properties: {
          sceneDescription: {
            type: "string",
            description: "Short human-readable description of what happens in this scene.",
          },
          visualPrompt: {
            type: "string",
            description: "The full detailed English AI-video-generation prompt for this scene.",
          },
          durationSeconds: {
            type: "number",
            description: "Duration of this scene in seconds, between 3 and 5.",
          },
        },
        required: ["sceneDescription", "visualPrompt", "durationSeconds"],
      },
    },
  },
  required: ["storySummary", "scenes"],
};

export const SINGLE_SCENE_TOOL_SCHEMA: JSONSchema = {
  type: "object",
  properties: {
    sceneDescription: {
      type: "string",
      description: "Short human-readable description of what happens in this scene.",
    },
    visualPrompt: {
      type: "string",
      description: "The full detailed English AI-video-generation prompt for this scene.",
    },
  },
  required: ["sceneDescription", "visualPrompt"],
};

export const IMAGE_TOPIC_TOOL_SCHEMA: JSONSchema = {
  type: "object",
  properties: {
    topic: {
      type: "string",
      description: "A dense 2-4 sentence creative brief inferred from the reference image.",
    },
  },
  required: ["topic"],
};
