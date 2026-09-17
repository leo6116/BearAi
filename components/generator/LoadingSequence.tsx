"use client";

import { Check, Clapperboard, Film, PenLine, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { GenerationStep } from "@/types";
import { cn } from "@/lib/utils";

const ORDER: GenerationStep[] = [
  "writing-script",
  "breaking-scenes",
  "directing-shots",
  "finalizing",
];

const ICONS = [PenLine, Film, Clapperboard, Sparkles];
const MESSAGE_KEYS = ["writingScript", "breakingScenes", "directingShots", "finalizing"] as const;

export function LoadingSequence({ step }: { step: GenerationStep }) {
  const t = useTranslations("loading");
  const currentIndex = ORDER.indexOf(step);
  const steps = MESSAGE_KEYS.map((key, i) => ({ key: ORDER[i], label: t(key), icon: ICONS[i] }));

  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-24 text-center">
      <div className="relative mb-12 h-20 w-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="border-accent/40 absolute inset-0 rounded-full border-2 border-dashed"
        />
        <div className="absolute inset-3 flex items-center justify-center rounded-full bg-accent">
          <motion.div
            key={step}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {(() => {
              const Icon = steps[Math.max(currentIndex, 0)]?.icon ?? PenLine;
              return <Icon className="h-7 w-7 text-accent-foreground" strokeWidth={2} />;
            })()}
          </motion.div>
        </div>
      </div>

      <div className="w-full space-y-3 text-left">
        {steps.map((s, i) => {
          const isDone = i < currentIndex;
          const isActive = i === currentIndex;
          return (
            <div
              key={s.key}
              className={cn(
                "flex items-center gap-3 rounded-md border px-4 py-3 transition-colors duration-500",
                isActive && "border-accent bg-bg-secondary",
                isDone && "border-border bg-transparent opacity-60",
                !isActive && !isDone && "border-border bg-transparent opacity-30",
              )}
            >
              <div
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  isDone && "bg-accent text-accent-foreground",
                  isActive && "bg-accent/20 text-accent",
                  !isActive && !isDone && "bg-bg-tertiary text-text-secondary",
                )}
              >
                {isDone ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-sm font-medium",
                  isActive ? "text-text-primary" : "text-text-secondary",
                )}
              >
                {s.label}
              </span>
              {isActive && (
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                  className="ml-auto h-2 w-2 rounded-full bg-accent"
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {steps[Math.max(currentIndex, 0)]?.label}
      </p>
    </div>
  );
}
