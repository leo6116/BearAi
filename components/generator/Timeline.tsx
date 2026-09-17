"use client";

import { Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import { CopyButton } from "@/components/generator/CopyButton";
import { ExportMenu } from "@/components/generator/ExportMenu";
import { SceneCard } from "@/components/generator/SceneCard";
import { formatTimestamp } from "@/lib/utils";
import type { GenerationResult } from "@/types";

interface TimelineProps {
  result: GenerationResult;
  regeneratingScenes: Record<number, boolean>;
  onRegenerateScene: (sceneNumber: number) => void;
}

function buildAllPromptsText(result: GenerationResult, scenePrefix: string): string {
  return result.scenes
    .map((s) => `${scenePrefix} ${s.sceneNumber} (${s.durationSeconds}s):\n${s.visualPrompt}`)
    .join("\n\n" + "=".repeat(48) + "\n\n");
}

export function Timeline({ result, regeneratingScenes, onRegenerateScene }: TimelineProps) {
  const t = useTranslations("timeline");

  return (
    <div>
      <div className="mb-10 rounded-lg border border-border bg-bg-secondary p-6 md:p-8">
        <p className="eyebrow mb-3">{t("storySummaryLabel")}</p>
        <p className="text-lg leading-relaxed text-text-primary">{result.storySummary}</p>
      </div>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
          <Clock className="h-4 w-4 text-accent" />
          {t("totalDuration", {
            time: formatTimestamp(result.totalDurationSeconds),
            count: result.scenes.length,
          })}
        </div>
        <div className="flex items-center gap-3">
          <CopyButton
            text={buildAllPromptsText(result, t("scenePrefix"))}
            label={t("copyAllPrompts")}
          />
          <ExportMenu result={result} />
        </div>
      </div>

      <div className="space-y-6">
        {result.scenes.map((scene) => (
          <SceneCard
            key={scene.sceneNumber}
            scene={scene}
            isRegenerating={Boolean(regeneratingScenes[scene.sceneNumber])}
            onRegenerate={() => onRegenerateScene(scene.sceneNumber)}
          />
        ))}
      </div>
    </div>
  );
}
