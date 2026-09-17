"use client";

import { useEffect, useRef } from "react";
import { PenLine, Clapperboard, ClipboardCopy } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const STEPS = [
  {
    number: "01",
    icon: PenLine,
    title: "Drop an idea",
    description:
      "Type a topic or upload a reference image. BearAi reads it and infers the creative direction.",
  },
  {
    number: "02",
    icon: Clapperboard,
    title: "AI directs the shots",
    description:
      "A full script is written, broken into 3–5 second scenes, each staged with real cinematography.",
  },
  {
    number: "03",
    icon: ClipboardCopy,
    title: "Copy & generate",
    description:
      "Every scene ships with a shot-ready prompt. Paste it straight into Runway, Kling, Luma, or Sora.",
  },
];

export function HowItWorks() {
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
      <p className="eyebrow mb-4">How it works</p>
      <h2 className="max-w-2xl text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold leading-tight text-text-primary">
        Three steps between a blank page and a finished shot list.
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
          {STEPS.map((step, i) => {
            const Icon = step.icon;
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
