import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { work } from "@/content/work";
import { siteUrl } from "@/lib/siteUrl";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, priority: 1 },
    ...work.map((w) => ({ url: `${siteUrl}/work/${w.slug}`, priority: 0.8 })),
    ...projects.filter((p) => !p.demo).map((p) => ({ url: `${siteUrl}/projects/${p.slug}`, priority: 0.7 })),
  ];
}
