"use client";

import { Canvas, type CanvasProps } from "@react-three/fiber";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const MotionContext = createContext(true);

/** False when the visitor has asked the OS to reduce motion. */
export function useMotionAllowed() {
  return useContext(MotionContext);
}

export function readCssColor(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

type Props = CanvasProps & { label: string; className?: string };

/**
 * Canvas wrapper shared by every 3D piece: renders only while on screen,
 * and holds still when prefers-reduced-motion is set.
 */
export default function CanvasShell({ label, className, children, ...canvasProps }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [motion, setMotion] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotion(!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} role="img" aria-label={label}>
      <Canvas
        dpr={[1, 2]}
        frameloop={inView ? (motion ? "always" : "demand") : "never"}
        gl={{ antialias: true, alpha: true }}
        {...canvasProps}
      >
        <MotionContext.Provider value={motion}>{children}</MotionContext.Provider>
      </Canvas>
    </div>
  );
}
