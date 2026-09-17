"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Download, FileJson, FileText } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { GenerationResult } from "@/types";

function buildPlainText(result: GenerationResult): string {
  const header = `${result.storySummary}\n\nTotal duration: ${result.totalDurationSeconds}s\n`;
  const scenes = result.scenes
    .map(
      (s) =>
        `— Scene ${s.sceneNumber} (${s.startTime}s–${s.endTime}s, ${s.durationSeconds}s) —\n${s.sceneDescription}\n\n${s.visualPrompt}`,
    )
    .join("\n\n" + "=".repeat(48) + "\n\n");
  return `${header}\n${"=".repeat(48)}\n\n${scenes}`;
}

export function ExportMenu({ result }: { result: GenerationResult }) {
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
    await navigator.clipboard.writeText(buildPlainText(result));
    toast.success("All prompts copied as plain text");
    setOpen(false);
  }

  async function copyJson() {
    await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    toast.success("Copied as JSON");
    setOpen(false);
  }

  function downloadTxt() {
    const blob = new Blob([buildPlainText(result)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bearai-shot-list.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded bearai-shot-list.txt");
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
        Export
        <ChevronDown
          className={cn("h-4 w-4 transition-transform duration-300", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-2 w-64 overflow-hidden rounded-md border border-border bg-bg-secondary shadow-xl"
        >
          <MenuItem icon={FileText} label="Copy as plain text" onClick={copyPlainText} />
          <MenuItem icon={FileJson} label="Copy as JSON" onClick={copyJson} />
          <MenuItem icon={Download} label="Download as .txt" onClick={downloadTxt} />
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
