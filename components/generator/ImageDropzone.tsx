"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ImageIcon, Loader2, RotateCcw, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { fileToBase64 } from "@/lib/api";
import { useGenerationStore } from "@/store/generationStore";
import { cn } from "@/lib/utils";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024;

export function ImageDropzone() {
  const t = useTranslations("imageDropzone");
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const imagePreviewUrl = useGenerationStore((s) => s.imagePreviewUrl);
  const resolvedImageTopic = useGenerationStore((s) => s.resolvedImageTopic);
  const isAnalyzingImage = useGenerationStore((s) => s.isAnalyzingImage);
  const imageAnalysisError = useGenerationStore((s) => s.imageAnalysisError);
  const setImage = useGenerationStore((s) => s.setImage);
  const setResolvedImageTopic = useGenerationStore((s) => s.setResolvedImageTopic);
  const analyzeImage = useGenerationStore((s) => s.analyzeImage);

  const handleFile = useCallback(
    async (file: File | undefined) => {
      if (!file) return;

      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast.error(t("errorInvalidType"));
        return;
      }
      if (file.size > MAX_SIZE_BYTES) {
        toast.error(t("errorTooLarge"));
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      const base64 = await fileToBase64(file);
      setImage(base64, previewUrl);
      await analyzeImage();
    },
    [setImage, analyzeImage, t],
  );

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  }

  if (imagePreviewUrl) {
    return (
      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-lg border border-border bg-bg-secondary">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imagePreviewUrl} alt={t("altText")} className="max-h-72 w-full object-cover" />
          <button
            type="button"
            data-cursor-hover
            onClick={() => {
              setImage(null, null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="bg-bg-primary/80 absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-xs font-medium text-text-primary backdrop-blur hover:bg-bg-primary"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {t("replace")}
          </button>
        </div>

        <div>
          <label
            htmlFor="resolved-topic"
            className="mb-2 block text-sm font-medium text-text-secondary"
          >
            {t("creativeDirectionLabel")} {isAnalyzingImage && t("analyzingSuffix")}
          </label>
          {isAnalyzingImage ? (
            <div className="flex h-28 items-center justify-center gap-2 rounded-md border border-border bg-bg-tertiary text-sm text-text-secondary">
              <Loader2 className="h-4 w-4 animate-spin text-accent" />
              {t("analyzingText")}
            </div>
          ) : (
            <textarea
              id="resolved-topic"
              value={resolvedImageTopic ?? ""}
              onChange={(e) => setResolvedImageTopic(e.target.value)}
              rows={4}
              placeholder={t("resolvedPlaceholder")}
              className="placeholder:text-text-secondary/60 w-full resize-none rounded-md border border-border bg-bg-tertiary px-4 py-3 text-sm leading-relaxed text-text-primary focus-visible:border-accent"
            />
          )}
          {imageAnalysisError && (
            <p className="mt-2 text-sm text-red-400" role="alert">
              {imageAnalysisError}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      data-cursor-hover
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "flex h-64 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-bg-secondary text-center transition-colors duration-300",
        isDragging && "border-accent bg-bg-tertiary",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <div className="flex h-14 w-14 items-center justify-center rounded-pill bg-bg-tertiary">
        <UploadCloud className="h-6 w-6 text-accent" />
      </div>
      <p className="text-sm font-medium text-text-primary">
        {t("dropPrefix")} <span className="text-accent">{t("browse")}</span>
      </p>
      <p className="flex items-center gap-1.5 text-xs text-text-secondary">
        <ImageIcon className="h-3.5 w-3.5" />
        {t("hint")}
      </p>
    </div>
  );
}
