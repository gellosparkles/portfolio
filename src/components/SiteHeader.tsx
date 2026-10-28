import Link from "next/link";
import { site } from "@/content/site";

const nav = [
  { href: "/#work", label: "Work" },
  { href: "/#research", label: "Research" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/80 backdrop-blur" style={{ viewTransitionName: "site-header" }}>
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-semibold tracking-tight">
          {site.name}
        </Link>
        <nav className="flex items-center gap-4 text-sm text-muted sm:gap-6">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="label hidden hover:text-fg sm:inline">
              {n.label}
            </Link>
          ))}
          {site.links.resume && (
            <a
              href={site.links.resume}
              className="rounded-full border border-line px-3 py-1 text-fg hover:border-accent"
            >
              Resume
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}
