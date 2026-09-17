"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Loader2, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { CopyButton } from "@/components/generator/CopyButton";
import { formatTimeRange } from "@/lib/utils";
import type { Scene } from "@/types";

interface SceneCardProps {
  scene: Scene;
  isRegenerating: boolean;
  onRegenerate: () => void;
}

export function SceneCard({ scene, isRegenerating, onRegenerate }: SceneCardProps) {
  const t = useTranslations("sceneCard");

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-lg border border-border bg-bg-secondary p-6 md:p-8"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-pill bg-bg-tertiary text-sm font-bold text-text-primary">
            {scene.sceneNumber}
          </span>
          <span className="text-sm font-medium text-text-secondary">
            {formatTimeRange(scene.startTime, scene.endTime)}
          </span>
        </div>
        <Badge>{scene.durationSeconds}s</Badge>
      </div>

      <p className="mb-5 text-base leading-relaxed text-text-primary">{scene.sceneDescription}</p>

      <div className="mb-5 rounded-md border border-border bg-bg-tertiary p-4">
        <p className="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-text-secondary">
          {scene.visualPrompt}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <CopyButton text={scene.visualPrompt} />
        <button
          type="button"
          data-cursor-hover
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="inline-flex items-center gap-2 rounded-pill border border-border bg-transparent px-4 py-2 text-sm font-medium text-text-secondary transition-colors duration-300 hover:border-accent hover:text-accent disabled:opacity-50"
        >
          {isRegenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {isRegenerating ? t("regenerating") : t("regenerate")}
        </button>
      </div>

      {isRegenerating && (
        <div
          className="bg-bg-primary/40 absolute inset-0 rounded-lg backdrop-blur-[1px]"
          aria-hidden="true"
        />
      )}
    </motion.article>
  );
}
