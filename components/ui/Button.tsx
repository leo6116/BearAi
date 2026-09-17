"use client";

import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-accent-foreground hover:bg-accent-hover active:scale-[0.97] shadow-[0_0_0_0_rgba(255,214,10,0)] hover:shadow-[0_0_24px_0_rgba(255,214,10,0.35)]",
  secondary:
    "bg-bg-tertiary text-text-primary hover:bg-[#262626] active:scale-[0.97] border border-border",
  outline:
    "bg-transparent text-text-primary border border-border hover:border-accent hover:text-accent active:scale-[0.97]",
  ghost: "bg-transparent text-text-secondary hover:text-text-primary active:scale-[0.97]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm gap-1.5",
  md: "h-12 px-6 text-base gap-2",
  lg: "h-14 px-8 text-lg gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        data-cursor-hover
        className={cn(
          "inline-flex items-center justify-center rounded-pill font-semibold transition-all duration-300 ease-out-expo disabled:opacity-40 disabled:pointer-events-none whitespace-nowrap",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
