"use client";

import type { Experience } from "@/content/site";
import { demos } from "./lazy";
import { useInView } from "./hooks";

/** One experience entry: header, one sentence, chips, a live demo area and an optional link. */
export function DemoCard({ e }: { e: Experience }) {
  const { ref, inView, seen } = useInView<HTMLDivElement>();
  const Demo = e.demo ? demos[e.demo] : null;

  return (
    <li className="relative">
      <span className="absolute -left-[29px] top-2 h-2.5 w-2.5 rounded-full border-2 border-bg bg-accent" />
      <div className="rounded-2xl border border-line bg-surface p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4">
          <h3 className="font-semibold">
            {e.role} <span className="font-normal text-muted">· {e.org}</span>
          </h3>
          <p className="font-mono text-xs text-muted">
            {e.when} · {e.where}
          </p>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted">{e.summary}</p>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {e.chips.map((t) => (
            <li key={t} className="rounded-full border border-line px-2.5 py-0.5 text-xs">
              {t}
            </li>
          ))}
        </ul>

        <div ref={ref} className="mt-4 min-h-24">
          {Demo ? (
            seen && <Demo active={inView} />
          ) : (
            <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-muted">
              Interactive demo coming soon.
            </p>
          )}
        </div>

        {e.link && (
          <p className="mt-3 text-sm">
            <a href={e.link.href} target="_blank" rel="noreferrer" className="font-medium text-accent">
              {e.link.label} →
            </a>
          </p>
        )}
      </div>
    </li>
  );
}
