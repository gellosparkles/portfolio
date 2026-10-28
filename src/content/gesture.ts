// Values read from Figs. 5–10 of the paper. Rows = true label, columns = predicted.

export const gestureClasses = ["Left swipe", "Right swipe", "Pause", "Thumbs down", "Thumbs up"];
export const gestureEmoji = ["👈", "👉", "✋", "👎", "👍"];

export type ModelResult = {
  id: "mobilenet" | "rnn";
  name: string;
  accuracy: number;
  loss: number;
  confusion: number[][];
  perClass: { precision: number; recall: number; f1: number }[];
};

export const gestureModels: ModelResult[] = [
  {
    id: "mobilenet",
    name: "MobileNet + GRU",
    accuracy: 84.38,
    loss: 0.342,
    confusion: [
      [4, 2, 0, 2, 0],
      [0, 6, 0, 0, 0],
      [0, 0, 6, 0, 0],
      [0, 0, 0, 6, 0],
      [0, 1, 0, 0, 5],
    ],
    perClass: [
      { precision: 1.0, recall: 0.5, f1: 0.67 },
      { precision: 0.67, recall: 1.0, f1: 0.8 },
      { precision: 1.0, recall: 1.0, f1: 1.0 },
      { precision: 0.75, recall: 1.0, f1: 0.86 },
      { precision: 1.0, recall: 0.83, f1: 0.91 },
    ],
  },
  {
    id: "rnn",
    name: "RNN + GRU (baseline)",
    accuracy: 65.62,
    loss: 1.1513,
    confusion: [
      [4, 1, 3, 0, 0],
      [2, 4, 0, 0, 0],
      [1, 0, 4, 0, 1],
      [0, 0, 0, 6, 0],
      [1, 1, 0, 1, 3],
    ],
    perClass: [
      { precision: 0.5, recall: 0.5, f1: 0.5 },
      { precision: 0.67, recall: 0.67, f1: 0.67 },
      { precision: 0.57, recall: 0.67, f1: 0.62 },
      { precision: 0.86, recall: 1.0, f1: 0.92 },
      { precision: 0.75, recall: 0.5, f1: 0.6 },
    ],
  },
];
