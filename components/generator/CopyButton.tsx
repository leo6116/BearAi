"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export function CopyButton({ text, label = "Copy Prompt", className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Couldn't copy — please copy manually.");
    }
  }

  return (
    <button
      type="button"
      data-cursor-hover
      onClick={handleCopy}
      aria-live="polite"
      className={cn(
        "inline-flex items-center gap-2 rounded-pill border border-border bg-bg-tertiary px-4 py-2 text-sm font-medium text-text-primary transition-colors duration-300 hover:border-accent hover:text-accent",
        copied && "border-accent text-accent",
        className,
      )}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? "Copied" : label}
    </button>
  );
}
