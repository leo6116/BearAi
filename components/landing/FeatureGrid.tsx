"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Camera, ImageIcon, Layers, ListVideo, Sparkles, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

const FEATURE_META = [
  { icon: Sparkles, span: "md:col-span-7" },
  { icon: Camera, span: "md:col-span-5" },
  { icon: ImageIcon, span: "md:col-span-5" },
  { icon: ListVideo, span: "md:col-span-4" },
  { icon: Layers, span: "md:col-span-3" },
  { icon: Timer, span: "md:col-span-12" },
];

interface FeatureMessage {
  title: string;
  description: string;
}

export function FeatureGrid() {
  const t = useTranslations("featureGrid");
  const features = t.raw("features") as FeatureMessage[];

  return (
    <section className="border-b border-border px-6 py-28 md:px-20 md:py-40">
      <p className="eyebrow mb-4">{t("eyebrow")}</p>
      <h2 className="mb-16 max-w-2xl text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold leading-tight text-text-primary md:mb-20">
        {t("heading")}
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        {features.map((feature, i) => {
          const { icon: Icon, span } = FEATURE_META[i];
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "hover:border-accent/50 group rounded-lg border border-border bg-bg-secondary p-8 transition-colors duration-300",
                span,
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
