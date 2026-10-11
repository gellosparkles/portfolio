import type { ReactNode } from "react";

export function Section({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-5xl scroll-mt-16 px-4 py-16 sm:px-6">
      <h2 className="mb-8 text-2xl font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

export function Figure({ src, alt, caption, className }: { src: string; alt: string; caption: string; className?: string }) {
  return (
    <figure className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element -- small static figures; next/image adds nothing here */}
      <img src={src} alt={alt} loading="lazy" className="w-full rounded-xl border border-line bg-white" />
      <figcaption className="mt-2 text-xs text-muted">{caption}</figcaption>
    </figure>
  );
}
