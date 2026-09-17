"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Small yellow circle cursor that scales + inverts (mix-blend-mode: difference)
 * over interactive elements. Disabled entirely on touch devices and when the
 * user prefers reduced motion — the native cursor is left alone in both cases.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isNarrow = window.matchMedia("(max-width: 767px)").matches;
    if (isTouch || prefersReducedMotion || isNarrow) return;

    // matchMedia is only available client-side, so this feature-detection
    // result can't be computed during render — it must be set from an effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    let raf = 0;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    function onMove(e: MouseEvent) {
      targetX = e.clientX;
      targetY = e.clientY;
      setVisible(true);
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const interactive = el?.closest(
        'a, button, [data-cursor-hover], input, textarea, select, [role="button"]',
      );
      setHovering(Boolean(interactive));
    }

    function onLeave() {
      setVisible(false);
    }

    function tick() {
      currentX += (targetX - currentX) * 0.2;
      currentY += (targetY - currentY) * 0.2;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("has-custom-cursor");
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[999] rounded-full bg-accent transition-[width,height,opacity] duration-200 ease-out-expo"
      style={{
        width: hovering ? 48 : 16,
        height: hovering ? 48 : 16,
        opacity: visible ? 1 : 0,
        mixBlendMode: "difference",
      }}
    />
  );
}
