"use client";

import type { Project } from "@/content/projects";
import { demos } from "./demos/lazy";
import { useInView } from "./demos/hooks";

export function ProjectBody({ p }: { p: Project }) {
  return (
    <>
      <p className="font-mono text-xs text-muted">{p.kicker}</p>
      <h3 className="mt-2 text-xl font-semibold tracking-tight group-hover:text-accent">{p.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{p.summary}</p>
      <p className="mt-5">
        <span className="text-3xl font-semibold tracking-tight text-accent">{p.metric.value}</span>{" "}
        <span className="text-sm text-muted">{p.metric.label}</span>
      </p>
      <ul className="mt-4 flex flex-wrap gap-1.5">
        {p.tags.map((t) => (
          <li key={t} className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs">
            {t}
          </li>
        ))}
      </ul>
    </>
  );
}

/** A project without a case-study page: the card embeds its demo and spans the full grid row. */
export function ProjectDemoCard({ p }: { p: Project }) {
  const { ref, inView, seen } = useInView<HTMLDivElement>();
  const Demo = p.demo ? demos[p.demo] : null;
  return (
    <article className="flex flex-col rounded-2xl border border-line bg-surface p-6 md:col-span-2">
      <ProjectBody p={p} />
      <div ref={ref} className="mt-5 min-h-24">
        {Demo && seen && <Demo active={inView} />}
      </div>
    </article>
  );
}
