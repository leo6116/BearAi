"use client";

import { useEffect, useRef } from "react";
import { PenLine, Clapperboard, ClipboardCopy } from "lucide-react";
import { useTranslations } from "next-intl";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const STEP_ICONS = [PenLine, Clapperboard, ClipboardCopy];

interface StepMessage {
  number: string;
  title: string;
  description: string;
}

export function HowItWorks() {
  const t = useTranslations("howItWorks");
  const steps = t.raw("steps") as StepMessage[];
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
              end: "bottom 70%",
              scrub: 0.6,
            },
          },
        );
      }

      stepRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 48 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
            },
            delay: i * 0.05,
          },
        );
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="border-b border-border px-6 py-28 md:px-20 md:py-40">
      <p className="eyebrow mb-4">{t("eyebrow")}</p>
      <h2 className="max-w-2xl text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold leading-tight text-text-primary">
        {t("heading")}
      </h2>

      <div className="relative mt-20">
        <div className="absolute left-0 right-0 top-8 hidden h-px bg-border md:block">
          <div
            ref={lineRef}
            className="h-full w-full origin-left bg-accent"
            style={{ transform: "scaleX(0)" }}
          />
        </div>

        <div className="grid gap-12 md:grid-cols-3 md:gap-8">
          {steps.map((step, i) => {
            const Icon = STEP_ICONS[i];
            return (
              <div
                key={step.number}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                className="relative"
              >
                <div className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-md border border-border bg-bg-secondary">
                  <Icon className="h-7 w-7 text-accent" strokeWidth={1.75} />
                </div>
                <span className="mb-3 block text-sm font-semibold tracking-widest text-text-secondary">
                  {step.number}
                </span>
                <h3 className="mb-3 text-xl font-semibold text-text-primary md:text-2xl">
                  {step.title}
                </h3>
                <p className="max-w-xs text-base leading-relaxed text-text-secondary">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
