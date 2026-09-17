import { create } from "zustand";
import { requestGeneration, requestImageAnalysis, requestSceneRegeneration } from "@/lib/api";
import type {
  AspectRatio,
  DurationTarget,
  GenerationMode,
  GenerationResult,
  GenerationStep,
  Scene,
  ToneOption,
} from "@/types";

interface GenerationState {
  mode: GenerationMode;
  topic: string;
  imageBase64: string | null;
  imagePreviewUrl: string | null;
  resolvedImageTopic: string | null;
  durationTarget: DurationTarget;
  tone: ToneOption;
  aspectRatio: AspectRatio;

  step: GenerationStep;
  error: string | null;
  result: GenerationResult | null;
  isAnalyzingImage: boolean;
  imageAnalysisError: string | null;

  regeneratingScenes: Record<number, boolean>;
  copiedId: string | null;

  setMode: (mode: GenerationMode) => void;
  setTopic: (topic: string) => void;
  setImage: (base64: string | null, previewUrl: string | null) => void;
  setResolvedImageTopic: (topic: string) => void;
  setDurationTarget: (duration: DurationTarget) => void;
  setTone: (tone: ToneOption) => void;
  setAspectRatio: (ratio: AspectRatio) => void;

  analyzeImage: () => Promise<void>;
  runGeneration: () => Promise<GenerationResult | null>;
  regenerateScene: (sceneNumber: number, instruction?: string) => Promise<boolean>;
  setCopied: (id: string | null) => void;
  hydrateResult: (result: GenerationResult) => void;
  reset: () => void;
}

const initialFormState = {
  mode: "text" as GenerationMode,
  topic: "",
  imageBase64: null as string | null,
  imagePreviewUrl: null as string | null,
  resolvedImageTopic: null as string | null,
  durationTarget: 30 as DurationTarget,
  tone: "cinematic" as ToneOption,
  aspectRatio: "16:9" as AspectRatio,
};

export const useGenerationStore = create<GenerationState>((set, get) => ({
  ...initialFormState,
  step: "idle",
  error: null,
  result: null,
  isAnalyzingImage: false,
  imageAnalysisError: null,
  regeneratingScenes: {},
  copiedId: null,

  setMode: (mode) => set({ mode, error: null }),
  setTopic: (topic) => set({ topic }),
  setImage: (imageBase64, imagePreviewUrl) =>
    set({ imageBase64, imagePreviewUrl, resolvedImageTopic: null, imageAnalysisError: null }),
  setResolvedImageTopic: (resolvedImageTopic) => set({ resolvedImageTopic }),
  setDurationTarget: (durationTarget) => set({ durationTarget }),
  setTone: (tone) => set({ tone }),
  setAspectRatio: (aspectRatio) => set({ aspectRatio }),

  analyzeImage: async () => {
    const { imageBase64 } = get();
    if (!imageBase64) return;

    set({ isAnalyzingImage: true, imageAnalysisError: null });
    try {
      const resolvedImageTopic = await requestImageAnalysis(imageBase64);
      set({ resolvedImageTopic, isAnalyzingImage: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not analyze the image.";
      set({ isAnalyzingImage: false, imageAnalysisError: message });
    }
  },

  runGeneration: async () => {
    const { mode, topic, durationTarget, tone, aspectRatio, resolvedImageTopic } = get();

    set({ step: "writing-script", error: null, result: null });

    const stepTimeline: GenerationStep[] = [
      "writing-script",
      "breaking-scenes",
      "directing-shots",
      "finalizing",
    ];
    let stepIndex = 0;
    const stepInterval = setInterval(() => {
      stepIndex = Math.min(stepIndex + 1, stepTimeline.length - 1);
      set({ step: stepTimeline[stepIndex] });
    }, 1600);

    try {
      // Image mode always resolves to an edited topic string during the
      // analysis step, so the final generation call is a plain text-mode
      // request — this avoids re-running (and potentially diverging from
      // the user's edits with) a second vision analysis of the image.
      const payload =
        mode === "text"
          ? { mode: "text" as const, topic, durationTarget, tone, aspectRatio, previewOnly: false }
          : {
              mode: "text" as const,
              topic: resolvedImageTopic ?? "",
              durationTarget,
              tone,
              aspectRatio,
              previewOnly: false,
            };

      const data = await requestGeneration(payload);
      clearInterval(stepInterval);

      const result: GenerationResult = {
        storySummary: data.storySummary,
        totalDurationSeconds: data.totalDurationSeconds,
        scenes: data.scenes,
      };

      set({ step: "done", result });
      return result;
    } catch (err) {
      clearInterval(stepInterval);
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      set({ step: "error", error: message });
      return null;
    }
  },

  regenerateScene: async (sceneNumber, instruction) => {
    const { result, tone, aspectRatio } = get();
    if (!result) return false;

    const scene = result.scenes.find((s) => s.sceneNumber === sceneNumber);
    if (!scene) return false;

    const previous = result.scenes.find((s) => s.sceneNumber === sceneNumber - 1);
    const next = result.scenes.find((s) => s.sceneNumber === sceneNumber + 1);

    set((state) => ({
      regeneratingScenes: { ...state.regeneratingScenes, [sceneNumber]: true },
    }));

    try {
      const updatedScene: Scene = await requestSceneRegeneration({
        storySummary: result.storySummary,
        tone,
        aspectRatio,
        sceneNumber: scene.sceneNumber,
        startTime: scene.startTime,
        endTime: scene.endTime,
        durationSeconds: scene.durationSeconds,
        previousSceneDescription: previous?.sceneDescription,
        nextSceneDescription: next?.sceneDescription,
        instruction,
      });

      set((state) => ({
        result: state.result
          ? {
              ...state.result,
              scenes: state.result.scenes.map((s) =>
                s.sceneNumber === sceneNumber ? updatedScene : s,
              ),
            }
          : state.result,
      }));
      return true;
    } catch {
      return false;
    } finally {
      set((state) => ({
        regeneratingScenes: { ...state.regeneratingScenes, [sceneNumber]: false },
      }));
    }
  },

  setCopied: (copiedId) => set({ copiedId }),

  hydrateResult: (result) => set({ result, step: "done", error: null }),

  reset: () =>
    set({
      ...initialFormState,
      step: "idle",
      error: null,
      result: null,
      regeneratingScenes: {},
      isAnalyzingImage: false,
      imageAnalysisError: null,
    }),
}));
