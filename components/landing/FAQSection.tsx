"use client";

import { useTranslations } from "next-intl";
import { Accordion, type AccordionItem } from "@/components/ui/Accordion";

export function FAQSection() {
  const t = useTranslations("faq");
  const items = t.raw("items") as AccordionItem[];

  return (
    <section className="border-b border-border px-6 py-28 md:px-20 md:py-40">
      <p className="eyebrow mb-4">{t("eyebrow")}</p>
      <h2 className="mb-16 max-w-2xl text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold leading-tight text-text-primary md:mb-20">
        {t("heading")}
      </h2>
      <Accordion items={items} />
    </section>
  );
}
