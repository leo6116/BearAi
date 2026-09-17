import { Accordion } from "@/components/ui/Accordion";

const FAQ_ITEMS = [
  {
    question: "Do I need to know how to write AI video prompts?",
    answer:
      "No. BearAi writes the entire script and every shot-level prompt for you, using accurate cinematography terminology. You only provide a topic or an image.",
  },
  {
    question: "Which AI video tools do the prompts work with?",
    answer:
      "The prompts are written in dense, comma-separated cinematic style compatible with Runway, Kling, Luma, Pika, Sora, Veo, and most other text-to-video generators.",
  },
  {
    question: "Can I use a reference image instead of typing an idea?",
    answer:
      "Yes. Switch to image mode, upload a reference photo, and BearAi analyzes it to infer a creative direction you can edit before generating.",
  },
  {
    question: "Can I regenerate just one scene?",
    answer:
      "Yes. Every scene card has a Regenerate button that re-runs only that scene while keeping the rest of your timeline untouched.",
  },
  {
    question: "How long can my video be?",
    answer:
      "Choose a target duration of 15, 30, 60, or 90 seconds — BearAi breaks it into the right number of 3–5 second scenes automatically.",
  },
];

export function FAQSection() {
  return (
    <section className="border-b border-border px-6 py-28 md:px-20 md:py-40">
      <p className="eyebrow mb-4">FAQ</p>
      <h2 className="mb-16 max-w-2xl text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold leading-tight text-text-primary md:mb-20">
        Questions, answered.
      </h2>
      <Accordion items={FAQ_ITEMS} />
    </section>
  );
}
