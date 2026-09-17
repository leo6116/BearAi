"use client";

import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { Nav } from "@/components/landing/Nav";
import { InputPanel } from "@/components/generator/InputPanel";
import { LoadingSequence } from "@/components/generator/LoadingSequence";
import { useGenerationStore } from "@/store/generationStore";
import { saveSession } from "@/lib/sessionStorage";
import { generateSessionId } from "@/lib/utils";
import type { GenerationRequest } from "@/types";

export default function GeneratePage() {
  const router = useRouter();
  const step = useGenerationStore((s) => s.step);
  const error = useGenerationStore((s) => s.error);
  const runGeneration = useGenerationStore((s) => s.runGeneration);
  const mode = useGenerationStore((s) => s.mode);
  const topic = useGenerationStore((s) => s.topic);
  const resolvedImageTopic = useGenerationStore((s) => s.resolvedImageTopic);
  const durationTarget = useGenerationStore((s) => s.durationTarget);
  const tone = useGenerationStore((s) => s.tone);
  const aspectRatio = useGenerationStore((s) => s.aspectRatio);

  const isLoading =
    step === "writing-script" ||
    step === "breaking-scenes" ||
    step === "directing-shots" ||
    step === "finalizing";

  async function handleSubmit() {
    const result = await runGeneration();
    if (!result) {
      toast.error("Generation failed. Please try again.");
      return;
    }

    const sessionId = generateSessionId();
    const request: GenerationRequest = {
      mode: "text",
      topic: mode === "text" ? topic : resolvedImageTopic ?? "",
      durationTarget,
      tone,
      aspectRatio,
      previewOnly: false,
    };
    saveSession(sessionId, request, result);
    router.push(`/generate/${sessionId}`);
  }

  return (
    <>
      <Nav />
      <main className="min-h-[calc(100vh-88px)] px-6 py-20 md:px-20 md:py-28">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingSequence step={step} />
            </motion.div>
          ) : (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-14 text-center">
                <p className="eyebrow mb-4">Generator</p>
                <h1 className="mx-auto max-w-2xl text-[clamp(2rem,4.5vw,3.5rem)] font-black leading-[1.02] tracking-tightest text-text-primary">
                  Tell BearAi what to shoot.
                </h1>
              </div>
              {error && (
                <div
                  role="alert"
                  className="mx-auto mb-8 max-w-2xl rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-400"
                >
                  {error}
                </div>
              )}
              <InputPanel onSubmit={handleSubmit} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
