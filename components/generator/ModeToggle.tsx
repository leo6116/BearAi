"use client";

import { useTranslations } from "next-intl";
import { ImageIcon, Type } from "lucide-react";
import { Tabs } from "@/components/ui/Tabs";
import { useGenerationStore } from "@/store/generationStore";

export function ModeToggle() {
  const t = useTranslations("generate");
  const mode = useGenerationStore((s) => s.mode);
  const setMode = useGenerationStore((s) => s.setMode);

  return (
    <Tabs
      value={mode}
      onChange={setMode}
      options={[
        { value: "text", label: t("modeText"), icon: <Type className="h-4 w-4" /> },
        { value: "image", label: t("modeImage"), icon: <ImageIcon className="h-4 w-4" /> },
      ]}
    />
  );
}
