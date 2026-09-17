import type { AspectRatioConfig, DurationTargetConfig, ToneOptionConfig } from "@/types";

export const TONE_OPTIONS: ToneOptionConfig[] = [
  { value: "cinematic", label: "Cinematic", description: "Film-grade, moody, dramatic" },
  { value: "documentary", label: "Documentary", description: "Observational, authentic" },
  { value: "comedic", label: "Comedic", description: "Bright, punchy, exaggerated" },
  { value: "commercial", label: "Commercial", description: "Polished, ad-ready" },
  { value: "vlog", label: "Vlog", description: "Casual, handheld, intimate" },
];

export const ASPECT_RATIO_OPTIONS: AspectRatioConfig[] = [
  { value: "9:16", label: "9:16", description: "Vertical — Reels, TikTok, Shorts" },
  { value: "16:9", label: "16:9", description: "Widescreen — YouTube, landscape" },
  { value: "1:1", label: "1:1", description: "Square — feed posts" },
];

export const DURATION_OPTIONS: DurationTargetConfig[] = [
  { value: 15, label: "15s" },
  { value: 30, label: "30s" },
  { value: 60, label: "60s" },
  { value: 90, label: "90s" },
];
