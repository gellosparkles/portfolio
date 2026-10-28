import Link from "next/link";
import { ViewTransition } from "react";
import { NeuralHero } from "@/components/three/lazy";
import WorkRail from "@/components/WorkRail";
import { certifications, education, honors, interests, organizations, publications, site, skills, stats } from "@/content/site";
import { projects } from "@/content/projects";
import { work } from "@/content/work";

const slide = { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" };

// Case studies with their own pages (the cell-filament tool lives on the rail instead).
const caseStudies = projects.filter((p) => !p.demo);

// Organization tags in the site palette: robotics orange, cyber turquoise, software purple.
const tagColor: Record<string, string> = { Robotics: "var(--robotics)", Cyber: "var(--cyber)", Software: "var(--software)" };

function Heading({ id, n, title }: { id: string; n: string; title: string }) {
  return (
    <div id={id} className="mx-auto flex max-w-5xl scroll-mt-16 items-baseline gap-4 border-t border-line px-4 pt-6 sm:px-6">
      <span className="label">{n}</span>
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
    </div>
  );
}

export default function Home() {
  const { email, linkedin, github, resume } = site.links;
  const contacts = [
    email && { label: "Email", href: `mailto:${email}`, text: email },
    linkedin && { label: "LinkedIn", href: linkedin, text: linkedin.replace(/^https?:\/\/(www\.)?/, "") },
    github && { label: "GitHub", href: github, text: github.replace(/^https?:\/\//, "") },
    resume && { label: "Resume", href: resume, text: "PDF" },
  ].filter(Boolean) as { label: string; href: string; text: string }[];
  const external = (href: string) => (href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {});

  return (
    <ViewTransition enter={slide} exit={slide} default="none">
      <div>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div aria-hidden className="blob -left-24 top-10 h-72 w-72 bg-[var(--sage)]" />
          <div aria-hidden className="blob right-0 top-40 h-64 w-64 bg-[var(--coral)] [animation-delay:-9s]" />
          <div className="relative mx-auto grid max-w-5xl items-center gap-6 px-4 pb-12 pt-14 sm:px-6 md:grid-cols-[1.1fr_1fr] md:pt-24">
            <div>
              <p className="label">
                {site.focus} · USC ECE · {site.graduation.replace("Graduating ", "")}
              </p>
              <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-7xl">{site.name}</h1>
              <p className="label mt-2">Legal name {site.legalName}</p>
              <p className="mt-6 max-w-md text-xl leading-snug">{site.tagline}</p>
              <p className="mt-2 text-sm text-muted">{site.seeking}</p>
              <div className="mt-7 flex flex-wrap gap-2 text-sm">
                {contacts.map((c, i) => (
                  <a
                    key={c.label}
                    href={c.href}
                    className={
                      i === 0
                        ? "rounded-full bg-fg px-4 py-2 font-medium text-bg hover:opacity-85"
                        : "rounded-full border border-line px-4 py-2 hover:border-fg"
                    }
                    {...external(c.href)}
                  >
                    {c.label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <NeuralHero className="h-[280px] w-full sm:h-[380px]" />
              <p className="label mt-1 text-center">frames → MobileNet → GRU → gesture</p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <dl className="mx-auto grid max-w-5xl grid-cols-2 border-y border-line sm:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className={`px-4 py-6 sm:px-6 ${i % 2 ? "border-l" : ""} ${i > 1 ? "border-t sm:border-t-0" : ""} ${i === 2 ? "sm:border-l" : ""} border-line`}>
              <dt className="flex items-baseline gap-1.5">
                <span className="font-mono text-4xl font-medium tracking-tight sm:text-5xl">{s.value}</span>
                <span className="label">{s.unit}</span>
              </dt>
              <dd className="mt-2 text-xs text-muted">{s.label}</dd>
            </div>
          ))}
        </dl>

        {/* Work */}
        <section className="pb-16 pt-16">
          <Heading id="work" n="01" title="Selected work" />
          <div className="mt-6">
            <WorkRail items={work} />
          </div>
        </section>

        {/* Research + case studies */}
        <section className="pb-16">
          <Heading id="research" n="02" title="Research" />
          <ul className="mx-auto mt-6 max-w-5xl px-4 sm:px-6">
            {publications.map((p) => (
              <li key={p.title} className="border-b border-line py-4">
                <Link href={p.href} className="group flex items-baseline justify-between gap-4">
                  <span>
                    <span className="font-medium group-hover:text-accent">{p.title}</span>
                    <span className="mt-1 block text-sm text-muted">
                      {p.venue} · published as {p.me}
                    </span>
                  </span>
                  <span className="label shrink-0">Poster →</span>
                </Link>
              </li>
            ))}
            {caseStudies.map((p) => (
              <li key={p.slug} className="border-b border-line py-4">
                <Link href={`/projects/${p.slug}`} className="group flex items-baseline justify-between gap-4">
                  <span>
                    <span className="font-medium group-hover:text-accent">{p.title}</span>
                    <span className="mt-1 block text-sm text-muted">{p.kicker}</span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block font-mono text-xl">{p.metric.value}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Organizations */}
        <section className="pb-16">
          <Heading id="organizations" n="03" title="Organizations" />
          <ul className="mx-auto mt-6 grid max-w-5xl gap-3 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
            {organizations.map((o) => {
              const body = (
                <>
                  <span>
                    <span className="font-medium">
                      {o.org}
                      {o.href && <span aria-hidden className="ml-1 text-muted transition-colors group-hover:text-accent">↗</span>}
                    </span>
                    <span className="block text-xs text-muted">{o.role}</span>
                  </span>
                  <span className="label shrink-0 rounded-full border px-2 py-0.5" style={{ color: tagColor[o.tag], borderColor: tagColor[o.tag] }}>
                    {o.tag}
                  </span>
                </>
              );
              const box = "flex h-full items-center justify-between gap-3 rounded-lg border border-line bg-surface px-4 py-3";
              return (
                <li key={o.org}>
                  {o.href ? (
                    <a href={o.href} target="_blank" rel="noreferrer" className={`group ${box} transition-colors hover:border-accent`}>
                      {body}
                    </a>
                  ) : (
                    <div className={box}>{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        {/* About */}
        <section className="pb-16">
          <Heading id="about" n="04" title="About" />
          <div className="mx-auto mt-6 grid max-w-5xl gap-10 px-4 sm:px-6 md:grid-cols-2">
            <div>
              <p className="label">Education</p>
              <p className="mt-2 font-medium">{education.school}</p>
              <p className="text-sm text-muted">
                {education.degree} · {education.when}
              </p>
              <p className="mt-4 flex items-baseline gap-1.5">
                <span className="font-mono text-4xl font-medium tracking-tight">{education.gpa}</span>
                <span className="label">GPA</span>
              </p>
              <p className="label mt-8">Skills</p>
              <p className="mt-2 text-sm">{skills.join(" · ")}</p>
              <p className="label mt-6">Outside of work</p>
              <p className="mt-2 text-sm text-muted">{interests.join(" · ")}</p>
            </div>
            <div>
              <p className="label">Honors</p>
              <ul className="mt-2 divide-y divide-line border-y border-line">
                {honors.map((h) => (
                  <li key={h.title} className="py-2.5">
                    <p className="text-sm font-medium">{h.title}</p>
                    <p className="text-xs text-muted">{h.when}</p>
                  </li>
                ))}
              </ul>
              <p className="label mt-8">Certification</p>
              <ul className="mt-2 divide-y divide-line border-y border-line">
                {certifications.map((c) => (
                  <li key={c.title} className="py-2.5">
                    <p className="text-sm font-medium">{c.title}</p>
                    <p className="text-xs text-muted">
                      {c.org} · {c.when}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="pb-20">
          <Heading id="contact" n="05" title="Contact" />
          <ul className="mx-auto mt-6 grid max-w-5xl px-4 sm:grid-cols-2 sm:px-6">
            {contacts.map((c) => (
              <li key={c.label}>
                <a href={c.href} className="group flex items-baseline justify-between gap-4 border-b border-line py-4 sm:mr-6" {...external(c.href)}>
                  <span className="label">{c.label}</span>
                  <span className="font-mono text-sm group-hover:text-accent">{c.text} →</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </ViewTransition>
  );
}
