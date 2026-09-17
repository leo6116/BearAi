export function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[998] opacity-[0.05] mix-blend-overlay motion-safe:animate-grain"
    >
      <svg width="100%" height="100%">
        <filter id="bearai-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#bearai-noise)" />
      </svg>
    </div>
  );
}
