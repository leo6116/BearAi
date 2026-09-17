import type { Metadata } from "next";
import Link from "next/link";
import { Camera, Clapperboard, Sparkles } from "lucide-react";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About — BearAi",
  description: "Why BearAi exists and how it turns ideas into shot-ready AI video prompts.",
};

const PILLARS = [
  {
    icon: Sparkles,
    title: "Screenwriting, handled",
    description:
      "BearAi reads your topic — or a reference image — and writes a short-form script built for how people actually watch video today.",
  },
  {
    icon: Clapperboard,
    title: "Real direction, not guesswork",
    description:
      "Every scene is staged with intentional camera movement, framing, angle, and lighting, drawn from a professional cinematography vocabulary.",
  },
  {
    icon: Camera,
    title: "One paste away from a clip",
    description:
      "Prompts are dense, self-contained, and formatted the way generators like Runway, Kling, Luma, Pika, Sora, and Veo expect them.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="border-b border-border px-6 py-28 md:px-20 md:py-40">
          <p className="eyebrow mb-6">About BearAi</p>
          <h1 className="max-w-3xl text-[clamp(2.25rem,5vw,4.5rem)] font-black leading-[1.02] tracking-tightest text-text-primary">
            We built BearAi so you never have to write an AI video prompt by hand.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-text-secondary">
            Writing a good AI video prompt means knowing screenwriting, shot composition, and
            cinematography vocabulary all at once. Most creators know what they want a clip to
            feel like — not the exact words a video model needs to hear. BearAi closes that gap.
          </p>
        </section>

        <section className="border-b border-border px-6 py-28 md:px-20 md:py-40">
          <div className="grid gap-6 md:grid-cols-3">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div key={pillar.title} className="rounded-lg border border-border bg-bg-secondary p-8">
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
            Bring an idea. Leave with a shot list.
          </h2>
          <Link href="/generate">
            <Button size="lg">Start Generating</Button>
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
