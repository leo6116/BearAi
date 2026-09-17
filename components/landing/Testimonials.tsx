"use client";

import { useTranslations } from "next-intl";

interface TestimonialMessage {
  quote: string;
  name: string;
  role: string;
}

export function Testimonials() {
  const t = useTranslations("testimonials");
  const items = t.raw("items") as TestimonialMessage[];

  return (
    <section className="border-b border-border px-6 py-28 md:px-20 md:py-40">
      <p className="eyebrow mb-4">{t("eyebrow")}</p>
      <h2 className="mb-16 max-w-2xl text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold leading-tight text-text-primary md:mb-20">
        {t("heading")}
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item) => (
          <figure
            key={item.name}
            className="flex flex-col justify-between rounded-lg border border-border bg-bg-secondary p-8"
          >
            <blockquote className="text-lg leading-relaxed text-text-primary">
              &ldquo;{item.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-8 text-sm text-text-secondary">
              <span className="font-semibold text-text-primary">{item.name}</span> — {item.role}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
