import Link from "next/link";
import { ViewTransition, type ReactNode } from "react";
import WorkDemo from "@/components/WorkDemo";
import { certifications, education, honors, interests, organizations, publications, site, skills, stats } from "@/content/site";
import { projects } from "@/content/projects";
import { work } from "@/content/work";

const slide = { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" };

// Case studies with their own pages (the cell-filament tool is on the work list instead).
const caseStudies = projects.filter((p) => !p.demo);

// Ledger cell borders: 2 × 2 on phones, one row of 4 from sm up.
const CELL = ["pr-4", "border-l pl-4", "border-t pr-4 sm:border-t-0 sm:border-l sm:pl-4", "border-t border-l pl-4 sm:border-t-0"];

const pad = (n: number) => String(n).padStart(2, "0");
const external = (href: string) => (href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {});

function Heading({ id, title, aside }: { id: string; title: string; aside?: ReactNode }) {
  return (
    <div id={id} className="flex scroll-mt-20 flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-fg pt-4">
      <h2 className="font-serif text-3xl tracking-tight sm:text-4xl">{title}</h2>
      {aside && <p className="text-sm text-muted">{aside}</p>}
    </div>
  );
}

function Photo({ src, alt, caption, focus, ratio, fig, className = "", imgClass = "" }: { src: string; alt: string; caption: string; focus?: string; ratio?: string; fig: number; className?: string; imgClass?: string }) {
  return (
    <figure className={className}>
      <div className="print">
        {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized WebP/JPEG; next/image adds nothing here */}
        <img src={src} alt={alt} loading="lazy" className={`block w-full object-cover ${imgClass}`} style={{ objectPosition: focus, aspectRatio: ratio }} />
      </div>
      <figcaption className="mt-2 text-xs leading-snug text-muted">
        <span className="font-mono text-accent">Fig. {fig}</span> {caption}
      </figcaption>
    </figure>
  );
}

export default function Home() {
  const { email, linkedin, github, resume } = site.links;
  const contacts = [
    email && { label: "Email", href: `mailto:${email}`, text: email },
    linkedin && { label: "LinkedIn", href: linkedin, text: linkedin.replace(/^https?:\/\/(www\.)?/, "") },
    github && { label: "GitHub", href: github, text: github.replace(/^https?:\/\//, "") },
    resume && { label: "Resume", href: resume, text: "PDF, one page" },
  ].filter(Boolean) as { label: string; href: string; text: string }[];
  const [primary, ...rest] = contacts;
  const [lead, ...side] = site.heroPhotos;
  let fig = site.heroPhotos.length;

  return (
    <ViewTransition enter={slide} exit={slide} default="none">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero: who I am in my own words, next to photos from the work */}
        <section className="grid gap-10 pb-14 pt-10 md:grid-cols-12 md:gap-12 md:pt-16">
          <div className="md:col-span-6 md:pt-4">
            <p className="font-mono text-xs text-muted">
              {site.location} · USC Viterbi ECE · {site.graduation}
            </p>
            <h1 className="mt-5 font-serif text-6xl leading-none tracking-tight sm:text-7xl">{site.name}</h1>
            <p className="mt-6 font-serif text-[1.375rem] leading-[1.45] sm:text-2xl sm:leading-[1.45]">{site.intro}</p>
            <p className="mt-5 text-sm text-muted">
              My legal name is {site.legalName}; it is the name on my paper and certificate. {site.seeking}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
              {primary && (
                <a href={primary.href} className="rounded-sm bg-fg px-4 py-2 font-medium text-bg transition-opacity hover:opacity-85" {...external(primary.href)}>
                  {primary.label} me
                </a>
              )}
              {rest.map((c) => (
                <a key={c.label} href={c.href} className="ink-link" {...external(c.href)}>
                  {c.label}
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:col-span-6">
            <Photo {...lead} fig={1} className="col-span-2" imgClass="aspect-[3/2]" />
            {side.map((p, i) => (
              <Photo key={p.src} {...p} fig={i + 2} imgClass="aspect-square" />
            ))}
          </div>
        </section>

        {/* The headline numbers, as a plain ledger */}
        <dl className="grid grid-cols-2 border-y border-line sm:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className={`border-line py-5 ${CELL[i]}`}>
              <dt className="flex items-baseline gap-1.5">
                <span className="font-serif text-4xl tracking-tight">{s.value}</span>
                <span className="text-sm text-muted">{s.unit}</span>
              </dt>
              <dd className="mt-1 text-sm text-muted">{s.label}</dd>
            </div>
          ))}
        </dl>

        {/* Work: one spread per role, each led by a photo from the build */}
        <section className="pt-20">
          <Heading id="work" title="Selected work" aside="In resume order. Each one opens to a live demo and the full build log." />
          <ol>
            {work.map((w, i) => {
              const more = (w.media?.length ?? 0) - (w.media?.some((m) => m.src === w.cover?.src) ? 1 : 0);
              const flip = i % 2 === 1;
              const href = `/work/${w.slug}`;
              return (
                <li key={w.slug} className="grid gap-6 border-b border-line py-10 md:grid-cols-12 md:gap-10 md:py-14">
                  <div className={`md:col-span-5 ${flip ? "md:order-2" : ""}`}>
                    <p className="font-mono text-xs text-muted">
                      <span className="text-fg">{pad(i + 1)}</span> · {w.when}
                    </p>
                    <ViewTransition name={`title-${w.slug}`} share="morph" default="none">
                      <h3 className="mt-3 font-serif text-3xl leading-tight tracking-tight sm:text-4xl">
                        <Link href={href} transitionTypes={["nav-forward"]} className="hover:text-accent">
                          {w.title}
                        </Link>
                      </h3>
                    </ViewTransition>
                    <p className="mt-1 text-sm text-muted">{w.kicker}</p>
                    <p className="mt-5 text-lg leading-snug">{w.hook}</p>
                    <p className="mt-6 flex items-baseline gap-2">
                      <span className="font-serif text-5xl leading-none tracking-tight">{w.big.value}</span>
                      <span className="text-sm text-muted">{w.big.unit}</span>
                    </p>
                    <p className="mt-5 text-sm text-muted">{w.chips.join(" · ")}</p>
                    <Link href={href} transitionTypes={["nav-forward"]} className="ink-link mt-6 inline-block text-sm font-medium">
                      {w.media ? "Demo and build log" : "Open the demo"} →
                    </Link>
                  </div>

                  <div className={`md:col-span-7 ${flip ? "md:order-1" : ""}`}>
                    {w.cover ? (
                      <Link href={href} transitionTypes={["nav-forward"]} className="block" tabIndex={-1} aria-hidden>
                        <Photo
                          {...w.cover}
                          fig={++fig}
                          caption={more > 0 ? `${w.cover.caption} ${more} more in the build log.` : w.cover.caption}
                          imgClass="aspect-[3/2] transition-opacity hover:opacity-90"
                        />
                      </Link>
                    ) : (
                      <figure>
                        <div className="print p-3 sm:p-4">
                          <WorkDemo id={w.demo} />
                        </div>
                        <figcaption className="mt-2 text-xs text-muted">
                          <span className="font-mono text-accent">Fig. {++fig}</span> The tool from the workshop, running live. Drag the threshold.
                        </figcaption>
                      </figure>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Research and case studies */}
        <section className="pt-20">
          <Heading id="research" title="Research and case studies" aside="Published as Tz-Jing Lee." />
          <ul>
            {publications.map((p) => (
              <li key={p.title} className="border-b border-line">
                <Link href={p.href} className="group grid gap-2 py-5 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-8">
                  <span>
                    <span className="font-serif text-xl leading-snug group-hover:text-accent">{p.title}</span>
                    <span className="mt-1 block text-sm text-muted">
                      {p.authors.map((a, i) => (
                        <span key={a}>
                          {i > 0 && ", "}
                          {a === p.me ? <span className="text-fg">{a}</span> : a}
                        </span>
                      ))}
                      {" · "}
                      {p.venue}
                    </span>
                  </span>
                  <span className="text-sm">Read the case study →</span>
                </Link>
              </li>
            ))}
            {caseStudies.map((p) => (
              <li key={p.slug} className="border-b border-line">
                <Link href={`/projects/${p.slug}`} className="group grid gap-2 py-5 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-8">
                  <span>
                    <span className="font-serif text-xl leading-snug group-hover:text-accent">{p.title}</span>
                    <span className="mt-1 block text-sm text-muted">{p.kicker}</span>
                  </span>
                  <span className="flex items-baseline gap-2 sm:justify-end">
                    <span className="font-serif text-2xl">{p.metric.value}</span>
                    <span className="text-sm text-muted">{p.metric.label}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Organizations */}
        <section className="pt-20">
          <Heading id="organizations" title="Organizations" aside="Student groups I'm part of at USC." />
          <ul className="text-sm">
            {organizations.map((o) => (
              <li key={o.org} className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-0.5 border-b border-line py-4 sm:grid-cols-[14rem_1fr_auto]">
                {o.href ? (
                  <a href={o.href} target="_blank" rel="noreferrer" className="ink-link font-medium">
                    {o.org} <span aria-hidden className="text-muted">↗</span>
                  </a>
                ) : (
                  <span className="font-medium">{o.org}</span>
                )}
                <span className="order-3 col-span-2 text-muted sm:order-none sm:col-span-1">{o.role}</span>
                <span className="font-mono text-xs text-muted">{o.tag}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* About */}
        <section className="pt-20">
          <Heading id="about" title="About" />
          <div className="mt-8 grid gap-12 md:grid-cols-2">
            <div className="space-y-8">
              <div>
                <p className="label">Education</p>
                <p className="mt-2 font-medium">{education.school}</p>
                <p className="text-sm text-muted">
                  {education.degree} · {education.when}
                </p>
                <p className="mt-3 flex items-baseline gap-1.5">
                  <span className="font-serif text-4xl tracking-tight">{education.gpa}</span>
                  <span className="text-sm text-muted">GPA</span>
                </p>
              </div>
              <div>
                <p className="label">Tools I use</p>
                <p className="mt-2 leading-relaxed">{skills.join(", ")}.</p>
              </div>
              <div>
                <p className="label">Outside of work</p>
                <p className="mt-2 leading-relaxed">{interests.join(", ")}.</p>
              </div>
            </div>
            <div className="space-y-8">
              <div>
                <p className="label">Honors</p>
                <ul className="mt-2 divide-y divide-line border-y border-line">
                  {honors.map((h) => (
                    <li key={h.title} className="flex flex-wrap items-baseline justify-between gap-x-4 py-3">
                      <span className="text-sm font-medium">{h.title}</span>
                      <span className="font-mono text-xs text-muted">{h.when}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="label">Certification</p>
                <ul className="mt-2 divide-y divide-line border-y border-line">
                  {certifications.map((c) => (
                    <li key={c.title} className="py-3">
                      <p className="text-sm font-medium">{c.title}</p>
                      <p className="text-xs text-muted">
                        {c.org} · {c.when}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="pb-24 pt-20">
          <Heading id="contact" title="Contact" />
          <div className="mt-8 grid gap-10 md:grid-cols-12">
            <div className="md:col-span-7">
              <p className="font-serif text-2xl leading-snug sm:text-3xl">Email is the quickest way to reach me.</p>
              {primary && (
                <a href={primary.href} className="ink-link mt-4 inline-block font-serif text-2xl text-accent sm:text-3xl">
                  {primary.text}
                </a>
              )}
            </div>
            <ul className="text-sm md:col-span-5">
              {rest.map((c) => (
                <li key={c.label} className="border-b border-line first:border-t">
                  <a href={c.href} className="group flex items-baseline justify-between gap-4 py-3" {...external(c.href)}>
                    <span className="text-muted">{c.label}</span>
                    <span className="group-hover:text-accent">
                      {c.text} <span aria-hidden>→</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </ViewTransition>
  );
}
