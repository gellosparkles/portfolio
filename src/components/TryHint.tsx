import type { ReactNode } from "react";

/**
 * The one line that tells a visitor what to do with a demo ("Hover to rotate"). Larger and in the
 * accent colour so it reads before the demo's own captions; the pulsing dot draws the eye and stays
 * still when the OS asks for reduced motion.
 */
export default function TryHint({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`flex items-center gap-2.5 text-base font-semibold text-accent sm:text-lg ${className}`}>
      <span aria-hidden className="relative flex h-2.5 w-2.5 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:hidden" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
      </span>
      {children}
    </p>
  );
}
