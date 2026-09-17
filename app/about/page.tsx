import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Camera, Clapperboard, Sparkles } from "lucide-react";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/Button";

const PILLAR_ICONS = [Sparkles, Clapperboard, Camera];

interface PillarMessage {
  title: string;
  description: string;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("about");
  return {
    title: `${t("eyebrow")} — BearAi`,
    description: t("intro"),
  };
}

export default async function AboutPage() {
  const t = await getTranslations("about");
  const pillars = t.raw("pillars") as PillarMessage[];

  return (
    <>
      <Nav />
      <main>
        <section className="border-b border-border px-6 py-28 md:px-20 md:py-40">
          <p className="eyebrow mb-6">{t("eyebrow")}</p>
          <h1 className="max-w-3xl text-[clamp(2.25rem,5vw,4.5rem)] font-black leading-[1.02] tracking-tightest text-text-primary">
            {t("title")}
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-text-secondary">{t("intro")}</p>
        </section>

        <section className="border-b border-border px-6 py-28 md:px-20 md:py-40">
          <div className="grid gap-6 md:grid-cols-3">
            {pillars.map((pillar, i) => {
              const Icon = PILLAR_ICONS[i];
              return (
                <div
                  key={pillar.title}
                  className="rounded-lg border border-border bg-bg-secondary p-8"
                >
                  <Icon className="mb-6 h-8 w-8 text-accent" strokeWidth={1.5} />
                  <h2 className="mb-3 text-xl font-semibold text-text-primary">{pillar.title}</h2>
                  <p className="text-base leading-relaxed text-text-secondary">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="px-6 py-28 text-center md:px-20 md:py-40">
          <h2 className="mx-auto mb-8 max-w-xl text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold leading-tight text-text-primary">
            {t("ctaHeading")}
          </h2>
          <Link href="/generate">
            <Button size="lg">{t("ctaButton")}</Button>
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
