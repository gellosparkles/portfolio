import Link from "next/link";
import { NeuralHero } from "@/components/three/lazy";
import { Section } from "@/components/Section";
import { certifications, education, experience, honors, interests, publications, site, skills } from "@/content/site";
import { projects } from "@/content/projects";

export default function Home() {
  const { email, linkedin, github, resume } = site.links;
  const contacts = [
    email && { label: "Email", href: `mailto:${email}`, text: email },
    linkedin && { label: "LinkedIn", href: linkedin, text: linkedin.replace(/^https?:\/\/(www\.)?/, "") },
    github && { label: "GitHub", href: github, text: github.replace(/^https?:\/\//, "") },
    resume && { label: "Resume", href: resume, text: "Download PDF" },
  ].filter(Boolean) as { label: string; href: string; text: string }[];

  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-5xl items-center gap-6 px-4 pb-10 pt-12 sm:px-6 md:grid-cols-[1.05fr_1fr] md:pt-20">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            ECE · USC Viterbi · {site.graduation}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{site.name}</h1>
          <p className="mt-1 text-sm text-muted">Legal name: {site.legalName}</p>
          <p className="mt-5 text-lg leading-relaxed">{site.tagline}</p>
          <p className="mt-4 text-sm text-muted">{site.seeking}</p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Link href="#projects" className="rounded-full bg-accent px-4 py-2 font-medium text-bg hover:opacity-90">
              See projects
            </Link>
            {contacts.map((c) => (
              <a
                key={c.label}
                href={c.href}
                className="rounded-full border border-line px-4 py-2 hover:border-accent"
                {...(c.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
              >
                {c.label}
              </a>
            ))}
          </div>
        </div>
        <div className="relative">
          <NeuralHero className="h-[300px] w-full sm:h-[380px]" />
          <p className="mt-1 text-center font-mono text-[10px] text-muted">
            frames → MobileNet → GRU → gesture · move your pointer
          </p>
        </div>
      </section>

      {/* Stats strip */}
      <div className="border-y border-line bg-surface">
        <dl className="mx-auto grid max-w-5xl grid-cols-2 gap-px px-4 sm:grid-cols-4 sm:px-6">
          {[
            ["84.4%", "gesture-recognition accuracy (+18.8 pts)"],
            ["3.84", "GPA · Dean's List"],
            ["1st", "place, USC Buildathon (Hubl)"],
            ["CURVE", "research fellow, Khan Lab"],
          ].map(([v, l]) => (
            <div key={l} className="py-5">
              <dt className="sr-only">{l}</dt>
              <dd className="text-2xl font-semibold tracking-tight">{v}</dd>
              <dd className="text-xs text-muted">{l}</dd>
            </div>
          ))}
        </dl>
      </div>

      <Section id="experience" title="Experience">
        <ol className="relative space-y-8 border-l border-line pl-6">
          {experience.map((e) => (
            <li key={e.org + e.role} className="relative">
              <span className="absolute -left-[29px] top-2 h-2.5 w-2.5 rounded-full border-2 border-bg bg-accent" />
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="font-semibold">
                  {e.role} <span className="font-normal text-muted">· {e.org}</span>
                </h3>
                <p className="font-mono text-xs text-muted">
                  {e.when} · {e.where}
                </p>
              </div>
              <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-muted">
                {e.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {e.tags.map((t) => (
                  <li key={t} className="rounded-full border border-line px-2.5 py-0.5 text-xs">
                    {t}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="projects" title="Featured projects">
        <div className="grid gap-5 md:grid-cols-2">
          {projects.map((p) => (
            <Link
              key={p.slug}
              href={`/projects/${p.slug}`}
              className="group flex flex-col rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-accent"
            >
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
              <span className="mt-5 text-sm font-medium text-accent">Read the case study →</span>
            </Link>
          ))}
        </div>
      </Section>

      <Section id="research" title="Research">
        {publications.map((p) => (
          <article key={p.title} className="rounded-2xl border border-line bg-surface p-6">
            <h3 className="text-lg font-semibold leading-snug">{p.title}</h3>
            <p className="mt-2 text-sm text-muted">
              {p.authors.map((a, i) => (
                <span key={a}>
                  {a === p.me ? <strong className="font-semibold text-fg">{a}</strong> : a}
                  {i < p.authors.length - 1 ? ", " : ""}
                </span>
              ))}
              <span className="ml-1 text-xs">(published as {p.me})</span>
            </p>
            <p className="mt-1 text-sm italic text-muted">{p.venue}</p>
            <p className="mt-3 text-sm">{p.highlight}</p>
            <div className="mt-4 flex gap-4 text-sm">
              <Link href={p.href} className="font-medium text-accent">
                Explore the results →
              </Link>
              {p.paperPdf && (
                <a href={p.paperPdf} className="text-muted hover:text-fg">
                  PDF
                </a>
              )}
            </div>
          </article>
        ))}
      </Section>

      <Section id="about" title="About">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr]">
          <div className="space-y-4 leading-relaxed">
            {site.about.map((para) => (
              <p key={para}>{para}</p>
            ))}
            <h3 className="pt-4 text-sm font-semibold uppercase tracking-wider text-muted">Education</h3>
            <ul className="space-y-3">
              {education.map((e) => (
                <li key={e.school}>
                  <p className="font-medium">{e.school}</p>
                  <p className="text-sm text-muted">
                    {e.degree}
                    {e.when && ` · ${e.when}`}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">Honors</h3>
              <ul className="mt-3 space-y-3">
                {honors.map((h) => (
                  <li key={h.title}>
                    <p className="font-medium">{h.title}</p>
                    <p className="text-sm text-muted">
                      {h.org} · {h.when}
                    </p>
                    {h.detail && <p className="text-sm text-muted">{h.detail}</p>}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">Certifications</h3>
              <ul className="mt-3 space-y-3">
                {certifications.map((c) => (
                  <li key={c.title}>
                    <p className="font-medium">
                      {c.url ? (
                        <a href={c.url} className="hover:text-accent">
                          {c.title}
                        </a>
                      ) : (
                        c.title
                      )}
                    </p>
                    <p className="text-sm text-muted">{c.org}</p>
                    <p className="text-sm text-muted">{c.when}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <h3 className="mt-12 text-sm font-semibold uppercase tracking-wider text-muted">Skills</h3>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((s) => (
            <div key={s.group}>
              <p className="font-medium">{s.group}</p>
              <ul className="mt-2 space-y-1 text-sm text-muted">
                {s.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <p className="mx-auto -mt-8 max-w-5xl px-4 text-sm text-muted sm:px-6">
        <span className="font-medium text-fg">Outside of work:</span> {interests.join(" · ")}
      </p>

      <Section id="contact" title="Contact">
        <p className="max-w-xl leading-relaxed">
          I&apos;m looking for internships in ML / AI research and applied ML engineering. The fastest way to reach
          me is below.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {contacts.map((c) => (
            <li key={c.label}>
              <a
                href={c.href}
                className="flex items-baseline justify-between rounded-xl border border-line bg-surface px-4 py-3 hover:border-accent"
                {...(c.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
              >
                <span className="text-sm text-muted">{c.label}</span>
                <span className="font-mono text-sm">{c.text}</span>
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
