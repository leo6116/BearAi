"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { MagneticButton } from "@/components/ui/MagneticButton";

const HEADLINE_LINE_1 = ["From", "Idea", "to"];
const HEADLINE_LINE_2 = ["Shot-Ready", "Prompts."];

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
};

const word: Variants = {
  hidden: { y: "110%", opacity: 0 },
  show: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !sectionRef.current || !parallaxRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(parallaxRef.current, {
        yPercent: 18,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-b border-border px-6 pb-24 pt-40 md:px-20 md:pb-36 md:pt-52"
    >
      <div
        ref={parallaxRef}
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-24 h-[420px] w-[420px] rounded-full bg-accent/10 blur-[120px] md:h-[600px] md:w-[600px]"
      />

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="eyebrow relative z-10 mb-8"
      >
        AI Video Script &amp; Prompt Generator
      </motion.p>

      <motion.h1
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-[16ch] text-[clamp(2.75rem,7.5vw,7rem)] font-black leading-[0.95] tracking-tightest text-text-primary"
      >
        <span className="block overflow-hidden">
          {HEADLINE_LINE_1.map((w, i) => (
            <span key={i} className="mr-[0.25em] inline-block overflow-hidden align-bottom">
              <motion.span variants={word} className="inline-block">
                {w}
              </motion.span>
            </span>
          ))}
        </span>
        <span className="block overflow-hidden">
          {HEADLINE_LINE_2.map((w, i) => (
            <span key={i} className="mr-[0.25em] inline-block overflow-hidden align-bottom">
              <motion.span
                variants={word}
                className={i === HEADLINE_LINE_2.length - 1 ? "inline-block text-accent" : "inline-block"}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </span>
      </motion.h1>

      <div className="relative z-10 mt-12 flex max-w-content flex-col items-start gap-10 md:mt-16 md:flex-row md:items-end md:justify-between">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="max-w-md text-base leading-relaxed text-text-secondary md:text-lg"
        >
          Give BearAi a topic or a reference image. It writes the script, breaks it into
          scenes, and crafts detailed, cinematography-grade prompts — ready to paste into
          Runway, Kling, Luma, Pika, Sora, or Veo.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85 }}
        >
          <Link href="/generate">
            <MagneticButton className="group h-16 gap-3 rounded-pill bg-accent px-9 text-lg font-semibold text-accent-foreground transition-colors duration-300 hover:bg-accent-hover">
              Start Generating
              <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </MagneticButton>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
