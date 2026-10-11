import { site } from "@/content/site";

export default function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-6 text-xs text-muted sm:px-6">
        <p>
          © {site.name} ({site.legalName})
        </p>
        <p>Built with Next.js, React Three Fiber and Tailwind. Hosted on Vercel.</p>
      </div>
    </footer>
  );
}
