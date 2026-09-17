import { z } from "zod";
import { generateStructured } from "@/lib/anthropic";
import {
  CINEMATOGRAPHY_SYSTEM_PROMPT,
  IMAGE_TOPIC_EXTRACTION_SYSTEM_PROMPT,
  JSON_RETRY_INSTRUCTION,
  buildSingleSceneUserPrompt,
  buildUserPrompt,
} from "@/lib/prompts";
import {
  imageTopicExtractionSchema,
  llmSceneResponseSchema,
  llmSingleSceneResponseSchema,
} from "@/lib/schemas";
import {
  IMAGE_TOPIC_TOOL_SCHEMA,
  SCRIPT_TOOL_SCHEMA,
  SINGLE_SCENE_TOOL_SCHEMA,
} from "@/lib/toolSchemas";
import type { AspectRatio, Scene, ToneOption } from "@/types";

async function parseWithRetry<T>(
  schema: z.ZodType<T>,
  attempt: () => Promise<unknown>,
  retryAttempt: () => Promise<unknown>,
): Promise<T> {
  const first = await attempt();
  const firstParsed = schema.safeParse(first);
  if (firstParsed.success) return firstParsed.data;

  const retried = await retryAttempt();
  const retryParsed = schema.safeParse(retried);
  if (retryParsed.success) return retryParsed.data;

  throw new Error(
    `LLM response failed schema validation after retry: ${retryParsed.error.issues.map((i) => i.message).join("; ")}`,
  );
}

export async function extractTopicFromImage(
  imageBase64: string,
  imageMediaType: string,
): Promise<string> {
  const userPrompt =
    "Analyze this reference image and infer a compelling short-form video topic/creative direction it suggests.";

  const result = await parseWithRetry(
    imageTopicExtractionSchema,
    () =>
      generateStructured({
        systemPrompt: IMAGE_TOPIC_EXTRACTION_SYSTEM_PROMPT,
        userPrompt,
        toolName: "emit_topic",
        toolDescription: "Emit the inferred creative topic/brief for the image.",
        schema: IMAGE_TOPIC_TOOL_SCHEMA,
        imageBase64,
        imageMediaType,
        maxTokens: 1024,
      }),
    () =>
      generateStructured({
        systemPrompt: IMAGE_TOPIC_EXTRACTION_SYSTEM_PROMPT,
        userPrompt: `${userPrompt}\n\n${JSON_RETRY_INSTRUCTION}`,
        toolName: "emit_topic",
        toolDescription: "Emit the inferred creative topic/brief for the image.",
        schema: IMAGE_TOPIC_TOOL_SCHEMA,
        imageBase64,
        imageMediaType,
        maxTokens: 1024,
      }),
  );

  return result.topic;
}

export interface GenerateScriptParams {
  topic: string;
  durationTarget: number;
  tone: ToneOption;
  aspectRatio: AspectRatio;
}

export interface ScriptResult {
  storySummary: string;
  totalDurationSeconds: number;
  scenes: Scene[];
}

export async function generateScript(params: GenerateScriptParams): Promise<ScriptResult> {
  const userPrompt = buildUserPrompt(params);

  const result = await parseWithRetry(
    llmSceneResponseSchema,
    () =>
      generateStructured({
        systemPrompt: CINEMATOGRAPHY_SYSTEM_PROMPT,
        userPrompt,
        toolName: "emit_shot_list",
        toolDescription: "Emit the script summary and full scene-by-scene shot list.",
        schema: SCRIPT_TOOL_SCHEMA,
        maxTokens: 8192,
      }),
    () =>
      generateStructured({
        systemPrompt: CINEMATOGRAPHY_SYSTEM_PROMPT,
        userPrompt: `${userPrompt}\n\n${JSON_RETRY_INSTRUCTION}`,
        toolName: "emit_shot_list",
        toolDescription: "Emit the script summary and full scene-by-scene shot list.",
        schema: SCRIPT_TOOL_SCHEMA,
        maxTokens: 8192,
      }),
  );

  const scenes = assembleTimeline(
    result.scenes.map((s) => ({
      sceneDescription: s.sceneDescription,
      visualPrompt: s.visualPrompt,
      durationSeconds: s.durationSeconds,
    })),
  );

  const totalDurationSeconds = scenes.reduce((sum, s) => sum + s.durationSeconds, 0);

  return { storySummary: result.storySummary, totalDurationSeconds, scenes };
}

function assembleTimeline(
  rawScenes: { sceneDescription: string; visualPrompt: string; durationSeconds: number }[],
): Scene[] {
  let cursor = 0;
  return rawScenes.map((raw, index) => {
    const durationSeconds = Math.round(raw.durationSeconds);
    const startTime = cursor;
    const endTime = cursor + durationSeconds;
    cursor = endTime;
    return {
      sceneNumber: index + 1,
      startTime,
      endTime,
      durationSeconds,
      sceneDescription: raw.sceneDescription,
      visualPrompt: raw.visualPrompt,
    };
  });
}

export interface RegenerateSceneParams {
  storySummary: string;
  tone: ToneOption;
  aspectRatio: AspectRatio;
  sceneNumber: number;
  startTime: number;
  endTime: number;
  durationSeconds: number;
  previousSceneDescription?: string;
  nextSceneDescription?: string;
  instruction?: string;
}

export async function regenerateScene(params: RegenerateSceneParams): Promise<Scene> {
  const userPrompt = buildSingleSceneUserPrompt(params);

  const result = await parseWithRetry(
    llmSingleSceneResponseSchema,
    () =>
      generateStructured({
        systemPrompt: CINEMATOGRAPHY_SYSTEM_PROMPT,
        userPrompt,
        toolName: "emit_scene",
        toolDescription: "Emit the regenerated scene description and visual prompt.",
        schema: SINGLE_SCENE_TOOL_SCHEMA,
        maxTokens: 2048,
      }),
    () =>
      generateStructured({
        systemPrompt: CINEMATOGRAPHY_SYSTEM_PROMPT,
        userPrompt: `${userPrompt}\n\n${JSON_RETRY_INSTRUCTION}`,
        toolName: "emit_scene",
        toolDescription: "Emit the regenerated scene description and visual prompt.",
        schema: SINGLE_SCENE_TOOL_SCHEMA,
        maxTokens: 2048,
      }),
  );

  return {
    sceneNumber: params.sceneNumber,
    startTime: params.startTime,
    endTime: params.endTime,
    durationSeconds: params.durationSeconds,
    sceneDescription: result.sceneDescription,
    visualPrompt: result.visualPrompt,
  };
}
