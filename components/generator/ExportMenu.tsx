"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, Download, FileJson, FileText } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { GenerationResult } from "@/types";

function buildPlainText(
  result: GenerationResult,
  scenePrefix: string,
  totalDurationLabel: string,
): string {
  const header = `${result.storySummary}\n\n${totalDurationLabel}: ${result.totalDurationSeconds}s\n`;
  const scenes = result.scenes
    .map(
      (s) =>
        `— ${scenePrefix} ${s.sceneNumber} (${s.startTime}s–${s.endTime}s, ${s.durationSeconds}s) —\n${s.sceneDescription}\n\n${s.visualPrompt}`,
    )
    .join("\n\n" + "=".repeat(48) + "\n\n");
  return `${header}\n${"=".repeat(48)}\n\n${scenes}`;
}

export function ExportMenu({ result }: { result: GenerationResult }) {
  const t = useTranslations("exportMenu");
  const tTimeline = useTranslations("timeline");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  async function copyPlainText() {
    await navigator.clipboard.writeText(
      buildPlainText(result, tTimeline("scenePrefix"), tTimeline("totalDurationLabel")),
    );
    toast.success(t("toastPlainText"));
    setOpen(false);
  }

  async function copyJson() {
    await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    toast.success(t("toastJson"));
    setOpen(false);
  }

  function downloadTxt() {
    const blob = new Blob(
      [buildPlainText(result, tTimeline("scenePrefix"), tTimeline("totalDurationLabel"))],
      { type: "text/plain;charset=utf-8" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bearai-shot-list.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(t("toastDownload"));
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        data-cursor-hover
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex items-center gap-2 rounded-pill border border-border bg-bg-tertiary px-4 py-2.5 text-sm font-medium text-text-primary transition-colors duration-300 hover:border-accent hover:text-accent"
      >
        {tTimeline("export")}
        <ChevronDown
          className={cn("h-4 w-4 transition-transform duration-300", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-2 w-64 overflow-hidden rounded-md border border-border bg-bg-secondary shadow-xl"
        >
          <MenuItem icon={FileText} label={t("copyAsText")} onClick={copyPlainText} />
          <MenuItem icon={FileJson} label={t("copyAsJson")} onClick={copyJson} />
          <MenuItem icon={Download} label={t("downloadTxt")} onClick={downloadTxt} />
        </div>
      )}
    </div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof FileText;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      data-cursor-hover
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-text-secondary transition-colors duration-200 hover:bg-bg-tertiary hover:text-text-primary"
    >
      <Icon className="h-4 w-4 text-accent" />
      {label}
    </button>
  );
}
