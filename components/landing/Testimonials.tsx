const TESTIMONIALS = [
  {
    quote:
      "I went from a one-line idea to a full shot list in under a minute. The prompts just work in Runway.",
    name: "Mara T.",
    role: "Short-form creator",
  },
  {
    quote:
      "The camera terminology is the part that used to take me hours. BearAi bakes it into every prompt automatically.",
    name: "Jonas K.",
    role: "Freelance editor",
  },
  {
    quote:
      "Uploading a moodboard image and getting a full scene breakdown back is genuinely the fastest pre-pro I've ever done.",
    name: "Priya S.",
    role: "Ad creative director",
  },
];

export function Testimonials() {
  return (
    <section className="border-b border-border px-6 py-28 md:px-20 md:py-40">
      <p className="eyebrow mb-4">Early feedback</p>
      <h2 className="mb-16 max-w-2xl text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold leading-tight text-text-primary md:mb-20">
        Built with creators who were tired of writing prompts by hand.
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <figure
            key={t.name}
            className="flex flex-col justify-between rounded-lg border border-border bg-bg-secondary p-8"
          >
            <blockquote className="text-lg leading-relaxed text-text-primary">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-8 text-sm text-text-secondary">
              <span className="font-semibold text-text-primary">{t.name}</span> — {t.role}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
