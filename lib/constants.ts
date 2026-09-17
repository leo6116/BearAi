import { useTranslations } from "next-intl";
import type { AspectRatioConfig, DurationTargetConfig, ToneOptionConfig } from "@/types";

export const DURATION_OPTIONS: DurationTargetConfig[] = [
  { value: 15, label: "15s" },
  { value: 30, label: "30s" },
  { value: 60, label: "60s" },
  { value: 90, label: "90s" },
];

const TONE_VALUES = ["cinematic", "documentary", "comedic", "commercial", "vlog"] as const;
const ASPECT_RATIO_VALUES = ["9:16", "16:9", "1:1"] as const;

export function useToneOptions(): ToneOptionConfig[] {
  const t = useTranslations("constants.tone");
  return TONE_VALUES.map((value) => ({
    value,
    label: t(`${value}.label`),
    description: t(`${value}.description`),
  }));
}

export function useAspectRatioOptions(): AspectRatioConfig[] {
  const t = useTranslations("constants.aspectRatio");
  return ASPECT_RATIO_VALUES.map((value) => ({
    value,
    label: t(`${value}.label`),
    description: t(`${value}.description`),
  }));
}
