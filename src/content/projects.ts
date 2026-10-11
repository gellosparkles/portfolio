export type Project = {
  slug: string;
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
    metric: { value: "84.4%", label: "test accuracy (baseline: 65.6%)" },
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
];
