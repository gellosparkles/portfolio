import Link from "next/link";
import { site } from "@/content/site";
import ThemeToggle from "./ThemeToggle";

const nav = [
  { href: "/#work", label: "Work" },
  { href: "/#research", label: "Research" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur" style={{ viewTransitionName: "site-header" }}>
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-serif text-xl tracking-tight">
          {site.name}
        </Link>
        <nav className="flex items-center gap-5 text-sm sm:gap-7">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="hidden text-muted transition-colors hover:text-fg sm:inline">
              {n.label}
            </Link>
          ))}
          {site.links.resume && (
            <a href={site.links.resume} className="ink-link font-medium">
              Resume
            </a>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
