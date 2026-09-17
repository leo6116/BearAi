"use client";

import { cn } from "@/lib/utils";

interface PillSelectOption<T extends string | number> {
  value: T;
  label: string;
}

interface PillSelectProps<T extends string | number> {
  label: string;
  options: PillSelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function PillSelect<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: PillSelectProps<T>) {
  return (
    <div>
      <p className="mb-3 text-sm font-medium text-text-secondary">{label}</p>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={String(option.value)}
              type="button"
              role="radio"
              aria-checked={active}
              data-cursor-hover
              onClick={() => onChange(option.value)}
              className={cn(
                "rounded-pill border px-4 py-2 text-sm font-medium transition-colors duration-300",
                active
                  ? "border-accent bg-accent text-accent-foreground"
                  : "hover:border-accent/50 border-border bg-bg-tertiary text-text-secondary hover:text-text-primary",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
