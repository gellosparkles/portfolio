import Link from "next/link";
import type { ReactNode } from "react";

export function CaseStudyHeader({
  kicker,
  title,
  lede,
  facts,
}: {
  kicker: string;
  title: string;
  lede: string;
  facts: [string, string][];
}) {
  return (
    <header className="mx-auto max-w-5xl px-4 pt-10 sm:px-6">
      <Link href="/#projects" className="text-sm text-muted hover:text-fg">
        ← All projects
      </Link>
      <p className="mt-6 font-mono text-xs uppercase tracking-widest text-accent">{kicker}</p>
      <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted">{lede}</p>
      <dl className="mt-8 grid grid-cols-2 gap-4 border-y border-line py-5 sm:grid-cols-4">
        {facts.map(([k, v]) => (
          <div key={k}>
            <dt className="text-xs text-muted">{k}</dt>
            <dd className="mt-1 font-medium">{v}</dd>
          </div>
        ))}
      </dl>
    </header>
  );
}

export function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-4 space-y-4 leading-relaxed">{children}</div>
    </section>
  );
}

export function Pipeline({ steps }: { steps: { name: string; detail: string }[] }) {
  return (
    <ol className="grid gap-3 sm:grid-flow-col sm:auto-cols-fr">
      {steps.map((s, i) => (
        <li key={s.name} className="relative rounded-xl border border-line bg-surface p-4">
          <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
          <p className="mt-1 font-medium">{s.name}</p>
          <p className="mt-1 text-sm text-muted">{s.detail}</p>
        </li>
      ))}
    </ol>
  );
}
