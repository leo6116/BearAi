"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { setLocale } from "@/lib/actions";
import { SUPPORTED_LOCALES, type Locale } from "@/lib/locale";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const t = useTranslations("languageToggle");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSelect(next: Locale) {
    if (next === locale || isPending) return;
    startTransition(async () => {
      await setLocale(next);
      router.refresh();
    });
  }

  return (
    <div
      role="group"
      aria-label={t("label")}
      className="inline-flex items-center gap-0.5 rounded-pill border border-border bg-bg-tertiary p-0.5"
    >
      {SUPPORTED_LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          data-cursor-hover
          aria-pressed={locale === code}
          onClick={() => handleSelect(code)}
          disabled={isPending}
          className={cn(
            "rounded-pill px-2.5 py-1 text-xs font-semibold uppercase tracking-wide transition-colors duration-300 disabled:opacity-60",
            locale === code
              ? "bg-accent text-accent-foreground"
              : "text-text-secondary hover:text-text-primary",
          )}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
