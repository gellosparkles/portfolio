import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import WorkDemo from "@/components/WorkDemo";
import { work, workBySlug } from "@/content/work";

// Every slug is prerendered below, so a shared URL-free shell buys nothing here.
export const instant = false;

export function generateStaticParams() {
  return work.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const w = workBySlug((await params).slug);
  return w ? { title: w.title, description: `${w.kicker}. ${w.hook}` } : {};
}

const slide = { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" };

export default async function WorkPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const i = work.findIndex((w) => w.slug === slug);
  if (i < 0) notFound();
  const w = work[i];
  const prev = work[i - 1];
  const next = work[i + 1];

  return (
    <ViewTransition enter={slide} exit={slide} default="none">
      <article className="mx-auto max-w-5xl px-4 pb-20 pt-8 sm:px-6">
        <Link href="/#work" transitionTypes={["nav-back"]} className="label hover:text-fg">
          ← All work
        </Link>

        <header className="mt-10 grid gap-6 border-b border-line pb-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="label">
              {w.kicker} · {w.when}
            </p>
            <ViewTransition name={`title-${w.slug}`} share="morph" default="none">
              <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">{w.title}</h1>
            </ViewTransition>
            <p className="mt-4 max-w-xl text-lg text-muted">{w.hook}</p>
          </div>
          <p className="md:text-right">
            <span className="block font-mono text-6xl font-medium tracking-tight sm:text-7xl">{w.big.value}</span>
            <span className="label">{w.big.unit}</span>
          </p>
        </header>

        <ViewTransition name={`demo-${w.slug}`} share="morph" default="none">
          <section aria-label="Interactive demo" className="mt-8 rounded-2xl border border-line bg-surface p-4 sm:p-6">
            <WorkDemo id={w.demo} />
          </section>
        </ViewTransition>

        <div className="mt-10 grid gap-8 md:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4 leading-relaxed">
            {w.details.map((d) => (
              <p key={d}>{d}</p>
            ))}
          </div>
          <div>
            <p className="label">Highlights</p>
            <ul className="mt-3 divide-y divide-line border-y border-line">
              {w.chips.map((c) => (
                <li key={c} className="py-2 text-sm">
                  {c}
                </li>
              ))}
            </ul>
            {w.link && (
              <a href={w.link.href} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm font-medium text-accent">
                {w.link.label} →
              </a>
            )}
          </div>
        </div>

        <nav aria-label="More work" className="mt-16 grid grid-cols-2 gap-4 border-t border-line pt-6">
          {prev ? (
            <Link href={`/work/${prev.slug}`} transitionTypes={["nav-back"]} className="group">
              <span className="label">← Previous</span>
              <span className="mt-1 block font-medium group-hover:text-accent">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={`/work/${next.slug}`} transitionTypes={["nav-forward"]} className="group text-right">
              <span className="label">Next →</span>
              <span className="mt-1 block font-medium group-hover:text-accent">{next.title}</span>
            </Link>
          )}
        </nav>
      </article>
    </ViewTransition>
  );
}
