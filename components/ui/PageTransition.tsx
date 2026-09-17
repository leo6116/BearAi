"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { usePathname } from "next/navigation";

const EASE = [0.76, 0, 0.24, 1] as const;

/**
 * Full-screen black/yellow wipe played between route changes. The overlay
 * grows from the bottom to cover the outgoing page, the new page mounts
 * underneath while hidden, then the overlay retreats back down — revealing
 * the new page from the top down.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const blackControls = useAnimationControls();
  const yellowControls = useAnimationControls();
  const isFirstRender = useRef(true);
  const [displayChildren, setDisplayChildren] = useState(children);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setDisplayChildren(children);
      return;
    }

    if (reducedMotion.current) {
      setDisplayChildren(children);
      return;
    }

    let cancelled = false;

    async function playWipe() {
      await Promise.all([
        yellowControls.start({ scaleY: 1, transition: { duration: 0.4, ease: EASE } }),
        blackControls.start({ scaleY: 1, transition: { duration: 0.4, delay: 0.08, ease: EASE } }),
      ]);
      if (cancelled) return;
      setDisplayChildren(children);
      await Promise.all([
        blackControls.start({ scaleY: 0, transition: { duration: 0.4, ease: EASE } }),
        yellowControls.start({ scaleY: 0, transition: { duration: 0.4, delay: 0.08, ease: EASE } }),
      ]);
    }

    playWipe();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      {displayChildren}
      <motion.div
        aria-hidden="true"
        initial={{ scaleY: 0 }}
        animate={yellowControls}
        style={{ transformOrigin: "bottom" }}
        className="pointer-events-none fixed inset-0 z-[996] bg-accent"
      />
      <motion.div
        aria-hidden="true"
        initial={{ scaleY: 0 }}
        animate={blackControls}
        style={{ transformOrigin: "bottom" }}
        className="pointer-events-none fixed inset-0 z-[997] bg-bg-primary"
      />
    </>
  );
}
