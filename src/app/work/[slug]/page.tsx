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
  const photos = w.media?.filter((m) => !m.slide) ?? [];
  const slides = w.media?.filter((m) => m.slide) ?? [];

  return (
    <ViewTransition enter={slide} exit={slide} default="none">
      <article className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6">
        <Link href="/#work" transitionTypes={["nav-back"]} className="label hover:text-fg">
          ← All work
        </Link>

        <header className="mt-10 grid gap-6 border-b border-line pb-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="label">
              {w.kicker} · {w.when}
            </p>
            <ViewTransition name={`title-${w.slug}`} share="morph" default="none">
              <h1 className="mt-3 font-serif text-5xl tracking-tight sm:text-7xl">{w.title}</h1>
            </ViewTransition>
            <p className="mt-4 max-w-xl text-lg text-muted">{w.hook}</p>
          </div>
          <p className="md:text-right">
            <span className="block font-serif text-6xl tracking-tight sm:text-7xl">{w.big.value}</span>
            <span className="label">{w.big.unit}</span>
          </p>
        </header>

        <ViewTransition name={`demo-${w.slug}`} share="morph" default="none">
          <section aria-label="Interactive demo" className="mt-8 rounded-2xl border border-line bg-surface p-4 sm:p-6">
            <WorkDemo id={w.demo} />
          </section>
        </ViewTransition>

        {w.media && (
          <section aria-labelledby="build-log" className="mt-10">
            <p id="build-log" className="label flex items-center justify-center gap-2">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
              Build log · {w.media.length} {w.media.length === 1 ? "photo" : "photos"} from the process
            </p>
            {/* One shared height keeps portrait notebook pages and landscape bench shots at their own ratios, centred per row. */}
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              {photos.map((m) => (
                <figure key={m.src} className="w-full sm:w-auto">
                  <a href={m.src} target="_blank" rel="noreferrer" className="group block overflow-hidden rounded-xl border border-line bg-surface">
                    {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized WebP; next/image adds nothing here */}
                    <img src={m.src} alt={m.alt} loading="lazy" className="w-full transition-transform duration-500 group-hover:scale-[1.03] sm:h-72 sm:w-auto" />
                  </a>
                  <figcaption className="mt-1.5 max-w-0 min-w-full text-xs text-muted">{m.caption}</figcaption>
                </figure>
              ))}
            </div>
            {slides.length > 0 && (
              <>
                {/* Deck: every slide shares one grid cell, shifted right and down by its index, so each is mostly hidden under the next until hovered.
                    The lift sits on the inner figure so the hover target never moves out from under the cursor. Plain column on phones. */}
                <ol className="mx-auto mt-8 flex max-w-3xl flex-col gap-4 sm:grid sm:gap-0" style={{ "--n": slides.length - 1 } as React.CSSProperties}>
                  {slides.map((m, i) => (
                    <li
                      key={m.src}
                      className="group hover:z-50! focus-within:z-50! sm:col-start-1 sm:row-start-1 sm:mt-[calc(var(--i)*1.75rem)] sm:ml-[calc(var(--i)*3.5rem)] sm:w-[calc(100%-var(--n)*3.5rem)]"
                      style={{ "--i": i, zIndex: i } as React.CSSProperties}
                    >
                      <figure className="relative transition-transform duration-300 sm:group-hover:-translate-y-3 sm:group-focus-within:-translate-y-3">
                        <a href={m.src} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-xl border border-line bg-surface shadow-[-8px_0_24px_-12px_rgb(0_0_0/0.35)]">
                          {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized WebP; next/image adds nothing here */}
                          <img src={m.src} alt={m.alt} loading="lazy" className="w-full" />
                        </a>
                        <figcaption className="mt-1.5 text-xs text-muted sm:pointer-events-none sm:absolute sm:inset-x-0 sm:bottom-0 sm:mt-0 sm:rounded-b-xl sm:bg-black/75 sm:px-3 sm:py-2 sm:text-white sm:opacity-0 sm:transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                          {i + 1}/{slides.length} · {m.caption}
                        </figcaption>
                      </figure>
                    </li>
                  ))}
                </ol>
                <p className="label mt-3 hidden text-center sm:block">Hover a slide to pull it forward</p>
              </>
            )}
          </section>
        )}

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
              <span className="mt-1 block font-serif text-2xl group-hover:text-accent">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={`/work/${next.slug}`} transitionTypes={["nav-forward"]} className="group text-right">
              <span className="label">Next →</span>
              <span className="mt-1 block font-serif text-2xl group-hover:text-accent">{next.title}</span>
            </Link>
          )}
        </nav>
      </article>
    </ViewTransition>
  );
}
