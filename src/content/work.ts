import { experience, type DemoId } from "./site";
import { projects } from "./projects";

/** One entry on the home-page rail, with a detail page at /work/<slug>. */
export type Work = {
  slug: string;
  title: string;
  kicker: string;
  when: string;
  big: { value: string; unit: string };
  hook: string;
  details: string[];
  chips: string[];
  demo: DemoId;
  link?: { label: string; href: string };
};

const cell = projects.find((p) => p.slug === "cell-filament-tool")!;

export const work: Work[] = [
  ...experience.map((e) => ({
    slug: e.slug,
    title: e.org,
    kicker: e.role,
    when: `${e.when} · ${e.where}`,
    big: e.big,
    hook: e.hook,
    details: e.details,
    chips: e.chips,
    demo: e.demo,
    link: e.link,
  })),
  {
    slug: "cell-filament",
    title: cell.title,
    kicker: cell.kicker,
    when: "Side project",
    big: { value: "2", unit: "university labs trained" },
    hook: "I hosted an AI workshop for two university bio-research labs, built around a live demo.",
    details: [
      "I hosted a hands-on AI workshop for graduate students and professors at two university bio-research labs, showing how AI coding agents can build their own analysis tools.",
      "The centrepiece was a live demo: a tool that counts which cells contain CTPS filaments, built with AI agents on CellProfiler plus a small ML model. Try the threshold above.",
      "Every cell in the demo is synthetic.",
    ],
    chips: cell.tags,
    demo: "cell-filament",
  },
];

export const workBySlug = (slug: string) => work.find((w) => w.slug === slug);
