import type { DemoId } from "./site";

export type Project = {
  slug: string;
  /** Set for projects without a case-study page; the card embeds this demo instead of linking. */
  demo?: DemoId;
  title: string;
  kicker: string;
  summary: string;
  metric: { value: string; label: string };
  tags: string[];
};

export const projects: Project[] = [
  {
    slug: "gesture-recognition",
    title: "Dynamic Hand-Gesture Recognition",
    kicker: "Research · Poster presentation",
    summary:
      "A MobileNet + GRU model that reads hand gestures from video clips. A pre-trained CNN extracts per-frame features, and a GRU models how they change over time. Hyperparameters were tuned with Optuna.",
    metric: { value: "85%", label: "test accuracy (baseline: 66%)" },
    tags: ["Keras", "MobileNet", "GRU", "Optuna", "Transfer learning"],
  },
  {
    slug: "sudoku-solver",
    title: "ML Sudoku Solver on an ESP32-CAM",
    kicker: "Embedded ML · Project founder",
    summary:
      "A camera rig that reads digits off a Sudoku grid with a TinyML classifier running on a microcontroller, then hands them to a Python solver. The project went through three stages: transfer learning, object detection and Python.",
    metric: { value: "~94%", label: "F1 on single-digit recognition" },
    tags: ["ESP32-CAM", "Edge Impulse", "Arduino", "Python", "MNIST"],
  },
  {
    slug: "cell-filament-tool",
    demo: "cell-filament",
    title: "Cell-Filament Counting Tool",
    kicker: "Side project · AI agents for bio-research",
    summary:
      "Counts which cells contain CTPS filaments using CellProfiler plus a small ML model, and was built with AI coding agents.",
    metric: { value: "0.19 → 0.79", label: "agreement with human counts" },
    tags: ["138 images", "421 training cells", "Presented to 2 biology labs in Taiwan"],
  },
];
