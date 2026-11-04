import Link from "next/link";
import { ViewTransition } from "react";
import WorkDemo from "@/components/WorkDemo";
import { NeuralHero } from "@/components/three/lazy";
import { certifications, education, honors, interests, organizations, publications, site, skills } from "@/content/site";
import { projects } from "@/content/projects";
import { work } from "@/content/work";
import TryHint from "@/components/TryHint";

const slide = { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" };

// Case studies with their own pages (the cell-filament tool is on the work list instead).
const caseStudies = projects.filter((p) => !p.demo);

const pad = (n: number) => String(n).padStart(2, "0");
const external = (href: string) => (href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {});

// Section titles: centred and a step above the project titles (text-4xl) so sections read apart.
function Heading({ id, title }: { id: string; title: string }) {
  return (
    <div id={id} className="scroll-mt-20 border-t border-fg pb-4 pt-8 text-center">
      <h2 className="font-serif text-5xl tracking-tight sm:text-6xl">{title}</h2>
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
  const about: { label: string; list?: true; items: { main: string; detail?: string; when?: string }[] }[] = [
    { label: "Education", items: [{ main: education.school, detail: `${education.degree} · GPA ${education.gpa}`, when: education.when }] },
    { label: "Honors", items: honors.map((h) => ({ main: h.title, detail: h.org, when: h.when })) },
    { label: "Certification", items: certifications.map((c) => ({ main: c.title, detail: c.org, when: c.when })) },
    { label: "Tools I use", list: true, items: [{ main: skills.join(", ") }] },
    { label: "Outside of work", list: true, items: [{ main: interests.join(", ") }] },
  ];
  let fig = 0;

  return (
    <ViewTransition enter={slide} exit={slide} default="none">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero: who I am in my own words, next to the gesture model */}
        <section className="grid gap-10 pb-6 pt-10 md:grid-cols-12 md:gap-12 md:pt-16">
          <div className="md:col-span-7 md:pt-4">
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

          {/* The gesture model as an interactive network: per-frame CNN features feed a GRU, which feeds 5 classes. */}
          <figure className="self-center md:col-span-5">
            <NeuralHero className="h-[280px] w-full sm:h-[380px]" />
            <figcaption className="mt-2 flex flex-col items-center gap-1 text-center">
              <TryHint>Hover to rotate</TryHint>
              <span className="font-mono text-xs text-muted">My gesture model: frames → MobileNet → GRU → gesture</span>
            </figcaption>
          </figure>
        </section>

        {/* Work: one spread per role, each led by a photo from the build */}
        <section className="pt-8">
          <Heading id="work" title="Selected work" />
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
          <Heading id="research" title="Research and case studies" />
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
          <Heading id="organizations" title="Organizations" />
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

        {/* About: one ruled list, every entry in the same shape (main line, detail line, dates on the right) */}
        <section className="pt-20">
          <Heading id="about" title="About" />
          <dl className="mx-auto mt-4 max-w-4xl border-t border-line">
            {about.map((g) => (
              <div key={g.label} className="grid gap-x-10 gap-y-2 border-b border-line py-6 md:grid-cols-[11rem_1fr]">
                <dt className="label pt-1">{g.label}</dt>
                <dd className="space-y-4">
                  {g.items.map((it) => (
                    <div key={it.main} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-0.5">
                      <div className="min-w-0">
                        <p className={g.list ? "leading-relaxed" : "font-medium"}>{it.main}</p>
                        {it.detail && <p className="text-sm text-muted">{it.detail}</p>}
                      </div>
                      {it.when && <p className="whitespace-nowrap font-mono text-xs text-muted">{it.when}</p>}
                    </div>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
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
