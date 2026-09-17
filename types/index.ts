import type { z } from "zod";
import type {
  aspectRatioSchema,
  durationTargetSchema,
  generationModeSchema,
  generationRequestSchema,
  generationResultSchema,
  regenerateSceneRequestSchema,
  sceneSchema,
  toneOptionSchema,
} from "@/lib/schemas";

export type ToneOption = z.infer<typeof toneOptionSchema>;
export type AspectRatio = z.infer<typeof aspectRatioSchema>;
export type DurationTarget = z.infer<typeof durationTargetSchema>;
export type GenerationMode = z.infer<typeof generationModeSchema>;
export type GenerationRequest = z.infer<typeof generationRequestSchema>;
export type Scene = z.infer<typeof sceneSchema>;
export type GenerationResult = z.infer<typeof generationResultSchema>;
export type RegenerateSceneRequest = z.infer<typeof regenerateSceneRequestSchema>;

export interface ToneOptionConfig {
  value: ToneOption;
  label: string;
  description: string;
}

export interface AspectRatioConfig {
  value: AspectRatio;
  label: string;
  description: string;
}

export interface DurationTargetConfig {
  value: DurationTarget;
  label: string;
}

export type GenerationStep =
  | "idle"
  | "writing-script"
  | "breaking-scenes"
  | "directing-shots"
  | "finalizing"
  | "done"
  | "error";

export interface StoredSession {
  sessionId: string;
  createdAt: string;
  request: GenerationRequest;
  result: GenerationResult;
}
