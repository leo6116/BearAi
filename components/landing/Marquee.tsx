const ITEMS = [
  "RUNWAY",
  "KLING",
  "LUMA",
  "PIKA",
  "SORA",
  "VEO",
  "DOLLY SHOT",
  "CRANE SHOT",
  "RACK FOCUS",
  "GOLDEN HOUR",
  "WHIP PAN",
  "TRACKING SHOT",
  "LOW ANGLE",
  "SHALLOW DEPTH OF FIELD",
];

export function Marquee() {
  return (
    <div className="overflow-hidden border-b border-border py-8">
      <div className="flex w-max motion-safe:animate-marquee motion-reduce:flex-wrap motion-reduce:gap-8">
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span
            key={i}
            className="mx-6 flex items-center gap-6 text-2xl font-bold tracking-tight text-text-secondary/70 md:text-3xl"
          >
            {item}
            <span aria-hidden="true" className="text-accent">
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
