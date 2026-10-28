"use client";

import Link from "next/link";
import { ViewTransition, useCallback, useEffect, useRef, useState } from "react";
import type { Work } from "@/content/work";
import { demos } from "./demos/lazy";
import { useInView } from "./demos/hooks";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Horizontal rail of work previews. The panel nearest the centre is in focus: it plays its demo,
 * its neighbours keep a still mount, and the rest render nothing. Each panel opens /work/<slug>.
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
          return (
            <li key={w.slug} data-focus={i === focus} className="w-[min(34rem,86vw)] shrink-0">
              <Link
                href={`/work/${w.slug}`}
                transitionTypes={["nav-forward"]}
                className="group block rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-fg sm:p-5"
                onFocus={() => i !== focus && go(i)}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="label">
                    {pad(i + 1)} · {w.kicker}
                  </span>
                  <span className="label shrink-0 transition-transform group-hover:translate-x-1">Open →</span>
                </div>

                <ViewTransition name={`demo-${w.slug}`} share="morph" default="none">
                  <div
                    inert
                    aria-hidden
                    className="pointer-events-none relative mt-3 h-52 overflow-hidden rounded-xl border border-line bg-bg sm:h-64 [mask-image:linear-gradient(to_bottom,black_75%,transparent)]"
                  >
                    {show && <Demo active={inView && i === focus} preview />}
                  </div>
                </ViewTransition>

                <div className="mt-4 flex items-end justify-between gap-4">
                  <div className="min-w-0">
                    <ViewTransition name={`title-${w.slug}`} share="morph" default="none">
                      <h3 className="text-lg font-semibold tracking-tight">{w.title}</h3>
                    </ViewTransition>
                    <p className="mt-1 text-sm text-muted">{w.hook}</p>
                  </div>
                  <p className="shrink-0 text-right">
                    <span className="block font-mono text-3xl font-medium tracking-tight sm:text-4xl">{w.big.value}</span>
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
