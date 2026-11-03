import { site } from "@/content/site";

export default function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-wrap items-baseline justify-between gap-2 px-4 py-6 text-xs text-muted sm:px-6">
        <p>
          © {site.name} ({site.legalName}) · {site.location}
        </p>
        <p>Photos are from the projects themselves. Built with Next.js and hosted on Vercel.</p>
      </div>
    </footer>
  );
}
