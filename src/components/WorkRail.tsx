"use client";

import Link from "next/link";
import { ViewTransition, useCallback, useEffect, useRef, useState } from "react";
import type { Work } from "@/content/work";
import { demos } from "./demos/lazy";
import { useInView } from "./demos/hooks";

const pad = (n: number) => String(n).padStart(2, "0");

// Each card takes the next colour in the site palette for its stat, rule and hover.
const HUES = ["var(--accent)", "var(--warn)", "var(--cyber)", "var(--software)"];

/**
 * Horizontal rail of work previews. The panel nearest the centre is in focus; it and its neighbours
 * play their demos, and the rest render nothing. Each panel opens /work/<slug>.
 */
export default function WorkRail({ items }: { items: Work[] }) {
  const rail = useRef<HTMLOListElement>(null);
  const { ref: section, inView } = useInView<HTMLDivElement>("0px");
  const [focus, setFocus] = useState(0);
  const [mounted, setMounted] = useState(() => new Set([0, 1]));

  const onScroll = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    const mid = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let dist = Infinity;
    Array.from(el.children).forEach((c, i) => {
      const li = c as HTMLElement;
      const d = Math.abs(li.offsetLeft + li.offsetWidth / 2 - mid);
      if (d < dist) [best, dist] = [i, d];
    });
    setFocus(best);
  }, []);

  useEffect(() => {
    setMounted((m) => (m.has(focus - 1) && m.has(focus) && m.has(focus + 1) ? m : new Set([...m, focus - 1, focus, focus + 1])));
  }, [focus]);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    let raf = 0;
    const handler = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(onScroll);
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => {
      el.removeEventListener("scroll", handler);
      cancelAnimationFrame(raf);
    };
  }, [onScroll]);

  const go = (i: number) => {
    const el = rail.current;
    const li = el?.children[Math.max(0, Math.min(items.length - 1, i))] as HTMLElement | undefined;
    if (!el || !li) return;
    el.scrollTo({ left: li.offsetLeft + li.offsetWidth / 2 - el.clientWidth / 2, behavior: "smooth" });
  };

  return (
    <div ref={section}>
      <div className="mx-auto flex max-w-5xl items-end justify-between px-4 sm:px-6">
        <p className="label" aria-live="polite">
          <span className="text-fg">{pad(focus + 1)}</span> / {pad(items.length)}
        </p>
        <div className="flex gap-2">
          {[
            { label: "Previous", d: -1, glyph: "←" },
            { label: "Next", d: 1, glyph: "→" },
          ].map((b) => (
            <button
              key={b.label}
              type="button"
              aria-label={`${b.label} project`}
              onClick={() => go(focus + b.d)}
              disabled={b.d < 0 ? focus === 0 : focus === items.length - 1}
              className="h-9 w-9 rounded-full border border-line font-mono text-sm transition-colors hover:border-fg disabled:opacity-30"
            >
              {b.glyph}
            </button>
          ))}
        </div>
      </div>

      <ol
        ref={rail}
        className="rail mt-5 flex gap-4 overflow-x-auto px-[max(16px,calc(50vw-17rem))] pb-4 sm:gap-6"
        aria-label="Selected work"
      >
        {items.map((w, i) => {
          const Demo = demos[w.demo];
          const show = mounted.has(i);
          const hue = HUES[i % HUES.length];
          return (
            <li key={w.slug} data-focus={i === focus} className="w-[min(34rem,86vw)] shrink-0" style={{ "--hue": hue } as React.CSSProperties}>
              <Link
                href={`/work/${w.slug}`}
                transitionTypes={["nav-forward"]}
                aria-label={`${w.title}: ${w.big.value} ${w.big.unit}`}
                className="group relative block overflow-hidden rounded-2xl border border-line bg-surface p-3 transition-colors hover:border-[var(--hue)] sm:p-4"
                onFocus={() => i !== focus && go(i)}
              >
                <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-[var(--hue)]" />
                <ViewTransition name={`demo-${w.slug}`} share="morph" default="none">
                  <div
                    inert
                    aria-hidden
                    className="pointer-events-none relative mt-1 h-56 overflow-hidden rounded-xl border border-line bg-bg sm:h-72 [mask-image:linear-gradient(to_bottom,black_80%,transparent)]"
                  >
                    {show && <Demo active={inView && Math.abs(i - focus) <= 1} preview />}
                  </div>
                </ViewTransition>

                <div className="mt-4 flex items-end justify-between gap-4 px-1 pb-1">
                  <ViewTransition name={`title-${w.slug}`} share="morph" default="none">
                    <h3 className="min-w-0 text-2xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-[2rem]">
                      {w.title}
                      <span aria-hidden className="ml-2 inline-block text-[var(--hue)] transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </h3>
                  </ViewTransition>
                  <p className="shrink-0 text-right">
                    <span className="block font-mono text-3xl font-medium tracking-tight text-[var(--hue)] sm:text-4xl">{w.big.value}</span>
                    <span className="label">{w.big.unit}</span>
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
