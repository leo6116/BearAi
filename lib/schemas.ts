import { z } from "zod";

export const toneOptionSchema = z.enum([
  "cinematic",
  "documentary",
  "comedic",
  "commercial",
  "vlog",
]);

export const aspectRatioSchema = z.enum(["9:16", "16:9", "1:1"]);

export const durationTargetSchema = z.union([
  z.literal(15),
  z.literal(30),
  z.literal(60),
  z.literal(90),
]);

export const generationModeSchema = z.enum(["text", "image"]);

export const generationRequestSchema = z
  .object({
    mode: generationModeSchema,
    topic: z.string().trim().min(1).max(2000).optional(),
    imageBase64: z.string().min(1).optional(),
    durationTarget: durationTargetSchema.default(30),
    tone: toneOptionSchema.default("cinematic"),
    aspectRatio: aspectRatioSchema.default("16:9"),
    previewOnly: z.boolean().optional().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.mode === "text" && (!data.topic || data.topic.trim().length === 0)) {
      ctx.addIssue({
        code: "custom",
        message: "topic is required when mode is 'text'",
        path: ["topic"],
      });
    }
    if (data.mode === "image" && (!data.imageBase64 || data.imageBase64.trim().length === 0)) {
      ctx.addIssue({
        code: "custom",
        message: "imageBase64 is required when mode is 'image'",
        path: ["imageBase64"],
      });
    }
  });

export const sceneSchema = z.object({
  sceneNumber: z.number().int().positive(),
  startTime: z.number().nonnegative(),
  endTime: z.number().positive(),
  durationSeconds: z.number().positive(),
  sceneDescription: z.string().min(1),
  visualPrompt: z.string().min(1),
});

export const generationResultSchema = z.object({
  storySummary: z.string().min(1),
  totalDurationSeconds: z.number().positive(),
  scenes: z.array(sceneSchema).min(1),
});

export const llmSceneResponseSchema = z.object({
  storySummary: z.string().min(1),
  scenes: z.array(
    z.object({
      sceneDescription: z.string().min(1),
      visualPrompt: z.string().min(1),
      durationSeconds: z.number().positive().max(6),
    }),
  ),
});

export const regenerateSceneRequestSchema = z.object({
  storySummary: z.string().min(1),
  tone: toneOptionSchema,
  aspectRatio: aspectRatioSchema,
  sceneNumber: z.number().int().positive(),
  startTime: z.number().nonnegative(),
  endTime: z.number().positive(),
  durationSeconds: z.number().positive(),
  previousSceneDescription: z.string().optional(),
  nextSceneDescription: z.string().optional(),
  instruction: z.string().max(500).optional(),
});

export const llmSingleSceneResponseSchema = z.object({
  sceneDescription: z.string().min(1),
  visualPrompt: z.string().min(1),
});

export const imageTopicExtractionSchema = z.object({
  topic: z.string().min(1),
});
