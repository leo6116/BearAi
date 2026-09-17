"use client";

import { cn } from "@/lib/utils";

export interface TabOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps<T extends string> {
  options: TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function Tabs<T extends string>({ options, value, onChange, className }: TabsProps<T>) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center gap-1 rounded-pill border border-border bg-bg-secondary p-1",
        className,
      )}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            role="tab"
            type="button"
            aria-selected={active}
            data-cursor-hover
            onClick={() => onChange(option.value)}
            className={cn(
              "relative flex items-center gap-2 rounded-pill px-5 py-2.5 text-sm font-semibold transition-colors duration-300",
              active
                ? "bg-accent text-accent-foreground"
                : "text-text-secondary hover:text-text-primary",
            )}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
