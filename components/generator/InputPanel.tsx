"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { ModeToggle } from "@/components/generator/ModeToggle";
import { ImageDropzone } from "@/components/generator/ImageDropzone";
import { PillSelect } from "@/components/ui/PillSelect";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { DURATION_OPTIONS, useAspectRatioOptions, useToneOptions } from "@/lib/constants";
import { useGenerationStore } from "@/store/generationStore";

interface InputPanelProps {
  onSubmit: () => void;
}

export function InputPanel({ onSubmit }: InputPanelProps) {
  const t = useTranslations("generate");
  const mode = useGenerationStore((s) => s.mode);
  const topic = useGenerationStore((s) => s.topic);
  const setTopic = useGenerationStore((s) => s.setTopic);
  const imageBase64 = useGenerationStore((s) => s.imageBase64);
  const resolvedImageTopic = useGenerationStore((s) => s.resolvedImageTopic);
  const isAnalyzingImage = useGenerationStore((s) => s.isAnalyzingImage);
  const durationTarget = useGenerationStore((s) => s.durationTarget);
  const setDurationTarget = useGenerationStore((s) => s.setDurationTarget);
  const tone = useGenerationStore((s) => s.tone);
  const setTone = useGenerationStore((s) => s.setTone);
  const aspectRatio = useGenerationStore((s) => s.aspectRatio);
  const setAspectRatio = useGenerationStore((s) => s.setAspectRatio);

  const topicFormSchema = z.object({
    topic: z.string().trim().min(3, t("topicErrorMin")).max(2000, t("topicErrorMax")),
  });
  type TopicFormValues = z.infer<typeof topicFormSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TopicFormValues>({
    resolver: zodResolver(topicFormSchema),
    defaultValues: { topic },
    values: { topic },
  });

  const canSubmitImage =
    mode === "image" &&
    Boolean(imageBase64) &&
    Boolean(resolvedImageTopic?.trim()) &&
    !isAnalyzingImage;

  function submitText() {
    onSubmit();
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-10 flex justify-center">
        <ModeToggle />
      </div>

      {mode === "text" ? (
        <form
          onSubmit={handleSubmit(() => {
            submitText();
          })}
          className="space-y-8"
        >
          <div>
            <label htmlFor="topic" className="mb-2 block text-sm font-medium text-text-secondary">
              {t("topicLabel")}
            </label>
            <textarea
              id="topic"
              rows={5}
              placeholder={t("topicPlaceholder")}
              {...register("topic", {
                onChange: (e) => setTopic(e.target.value),
              })}
              className="placeholder:text-text-secondary/60 w-full resize-none rounded-md border border-border bg-bg-tertiary px-4 py-3 text-base leading-relaxed text-text-primary focus-visible:border-accent"
            />
            {errors.topic && (
              <p className="mt-2 text-sm text-red-400" role="alert">
                {errors.topic.message}
              </p>
            )}
          </div>

          <GeneratorControls
            durationTarget={durationTarget}
            setDurationTarget={setDurationTarget}
            tone={tone}
            setTone={setTone}
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
          />

          <div className="flex justify-center pt-4">
            <MagneticButton
              as="button"
              className="group h-14 gap-2 rounded-pill bg-accent px-9 text-base font-semibold text-accent-foreground transition-colors duration-300 hover:bg-accent-hover"
            >
              {t("generateButton")}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </MagneticButton>
          </div>
        </form>
      ) : (
        <div className="space-y-8">
          <ImageDropzone />

          <GeneratorControls
            durationTarget={durationTarget}
            setDurationTarget={setDurationTarget}
            tone={tone}
            setTone={setTone}
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
          />

          <div className="flex justify-center pt-4">
            <MagneticButton
              as="button"
              onClick={() => canSubmitImage && submitText()}
              className={
                "group h-14 gap-2 rounded-pill bg-accent px-9 text-base font-semibold text-accent-foreground transition-colors duration-300 " +
                (canSubmitImage ? "hover:bg-accent-hover" : "pointer-events-none opacity-40")
              }
            >
              {t("generateButton")}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </MagneticButton>
          </div>
        </div>
      )}
    </div>
  );
}

function GeneratorControls({
  durationTarget,
  setDurationTarget,
  tone,
  setTone,
  aspectRatio,
  setAspectRatio,
}: {
  durationTarget: ReturnType<typeof useGenerationStore.getState>["durationTarget"];
  setDurationTarget: (v: 15 | 30 | 60 | 90) => void;
  tone: ReturnType<typeof useGenerationStore.getState>["tone"];
  setTone: (v: ReturnType<typeof useGenerationStore.getState>["tone"]) => void;
  aspectRatio: ReturnType<typeof useGenerationStore.getState>["aspectRatio"];
  setAspectRatio: (v: ReturnType<typeof useGenerationStore.getState>["aspectRatio"]) => void;
}) {
  const t = useTranslations("generate");
  const toneOptions = useToneOptions();
  const aspectRatioOptions = useAspectRatioOptions();

  return (
    <div className="space-y-6 border-t border-border pt-8">
      <PillSelect
        label={t("durationLabel")}
        options={DURATION_OPTIONS}
        value={durationTarget}
        onChange={setDurationTarget}
      />
      <PillSelect label={t("toneLabel")} options={toneOptions} value={tone} onChange={setTone} />
      <PillSelect
        label={t("aspectRatioLabel")}
        options={aspectRatioOptions}
        value={aspectRatio}
        onChange={setAspectRatio}
      />
    </div>
  );
}
