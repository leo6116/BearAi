"use client";

import { motion } from "framer-motion";
import { Camera, ImageIcon, Layers, ListVideo, Sparkles, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: Sparkles,
    title: "Screenwriting, automated",
    description: "A complete short-form storyline from a single topic or image — no blank page.",
    span: "md:col-span-7",
  },
  {
    icon: Camera,
    title: "Real cinematography vocabulary",
    description: "Dolly shots, rack focus, golden hour — accurate terms, chosen for the action.",
    span: "md:col-span-5",
  },
  {
    icon: ImageIcon,
    title: "Image-to-idea",
    description: "Upload a reference image; BearAi infers the creative direction for you.",
    span: "md:col-span-5",
  },
  {
    icon: ListVideo,
    title: "Scene-by-scene timeline",
    description: "Every clip is broken into 3–5 second scenes with exact timestamps.",
    span: "md:col-span-4",
  },
  {
    icon: Layers,
    title: "Built for every AI video tool",
    description: "Prompts formatted for Runway, Kling, Luma, Pika, Sora, and Veo alike.",
    span: "md:col-span-3",
  },
  {
    icon: Timer,
    title: "Regenerate a single scene",
    description: "Not happy with one beat? Re-roll just that scene, keep the rest intact.",
    span: "md:col-span-12",
  },
];

export function FeatureGrid() {
  return (
    <section className="border-b border-border px-6 py-28 md:px-20 md:py-40">
      <p className="eyebrow mb-4">Why BearAi</p>
      <h2 className="mb-16 max-w-2xl text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold leading-tight text-text-primary md:mb-20">
        Everything you need to go from idea to prompt, nothing you have to write by hand.
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        {FEATURES.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "group rounded-lg border border-border bg-bg-secondary p-8 transition-colors duration-300 hover:border-accent/50",
                feature.span,
              )}
            >
              <Icon className="mb-6 h-8 w-8 text-accent" strokeWidth={1.5} />
              <h3 className="mb-2 text-xl font-semibold text-text-primary">{feature.title}</h3>
              <p className="max-w-md text-base leading-relaxed text-text-secondary">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
