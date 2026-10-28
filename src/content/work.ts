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
    big: { value: "0.79", unit: "agreement with humans" },
    hook: "Counting cell filaments the way biologists do, with AI agents.",
    details: [
      "Counts which cells contain CTPS filaments, using CellProfiler plus a small ML model. Built with AI coding agents.",
      "Trained on 421 cells from 138 images, its agreement with human counts rose from 0.19 to 0.79. Presented to 2 biology labs in Taiwan.",
      "Every cell in the demo is synthetic.",
    ],
    chips: cell.tags,
    demo: "cell-filament",
  },
];

export const workBySlug = (slug: string) => work.find((w) => w.slug === slug);
