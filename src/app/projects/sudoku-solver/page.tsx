import type { Metadata } from "next";
import SudokuDemo from "@/components/SudokuDemo";
import { Block, CaseStudyHeader } from "@/components/CaseStudy";
import { Figure } from "@/components/Section";

export const metadata: Metadata = {
  title: "ML Sudoku Solver on an ESP32-CAM",
  description:
    "An embedded-ML Sudoku reader: an ESP32-CAM running an Edge Impulse digit classifier (~94% F1), feeding a Python backtracking solver.",
};

const stages = [
  {
    n: "Stage 1",
    title: "Single-digit transfer learning",
    body: "Trained an Edge Impulse transfer-learning model on MNIST handwritten digits. I tuned dataset size, training cycles, learning rate and batch size until it reached about 94% F1 without over- or underfitting, then deployed it as an Arduino library running on the ESP32-CAM, predicting every 7–8 seconds. Testing showed how much accuracy depends on digit size, stroke weight and screen brightness.",
    img: {
      src: "/projects/sudoku/edge-impulse-transfer.jpg",
      alt: "Edge Impulse training dashboard showing model accuracy and a confusion matrix",
      caption: "Edge Impulse training run for the single-digit classifier.",
    },
  },
  {
    n: "Stage 2",
    title: "Whole-grid object detection",
    body: "To read the whole grid at once, I moved to an object-detection model that outputs each digit's class, confidence, position and size. Labeling every training image by hand was the bottleneck, so I used generative AI tools to speed it up. Accuracy fell well short of the single-digit model, limited by the more complex task and the free tier's training budget.",
    img: {
      src: "/projects/sudoku/detection-output.jpg",
      alt: "Serial monitor output listing detected digits with confidence scores and bounding boxes",
      caption: "Object-detection output: label, confidence and bounding box per digit.",
    },
  },
  {
    n: "Stage 3",
    title: "Moving recognition into Python",
    body: "Working with students in the lab, I rebuilt recognition in Python so it could merge directly with my Python Sudoku solver. The current version reads a 3×3 grid and checks it against Sudoku rules. That's a narrower task, chosen on purpose to get the whole pipeline working end to end before scaling up.",
    img: {
      src: "/projects/sudoku/serial-predictions.jpg",
      alt: "Arduino serial monitor printing per-digit class probabilities",
      caption: "Per-digit probabilities streamed from the on-device model.",
    },
  },
];

export default function SudokuPage() {
  return (
    <article>
      <CaseStudyHeader
        kicker="Embedded ML · Project founder · Aug 2024 – Jun 2025"
        title="An ML Sudoku Solver Built on a Microcontroller Camera"
        lede="The goal: point a camera at a Sudoku and get it solved. That means running digit recognition on a microcontroller-class device, then handing the grid to a solver. I founded the project in Chang Gung University's Intelligent Control Lab: I built the rig, trained and deployed the models, and wrote an original solving algorithm that finishes in under 0.2 seconds."
        facts={[
          ["Single-digit F1", "~94%"],
          ["Hardware", "AI Thinker ESP32-CAM"],
          ["ML tooling", "Edge Impulse → Python"],
          ["Solver speed", "< 0.2 s per puzzle"],
        ]}
        link={{ href: "/projects/sudoku/engineering-notebook.pdf", label: "Read the engineering notebook (PDF)" }}
      />

      <Block title="Try the solver">
        <p className="text-muted">
          This is the solver half of the project, running live: backtracking that always fills the most constrained
          cell first. Pick <em>Hard</em> to watch it guess, hit a dead end (orange) and back up.
        </p>
        <SudokuDemo />
      </Block>

      <Block title="Hardware rig">
        <p>
          I built the enclosure from LEGO so I could change the camera height and angle quickly and measure them
          exactly. Both had to stay fixed for the model to work. An iPad underneath acts as a backlit input surface for
          sharper digit contrast, and side openings keep the ESP32-CAM&apos;s reset button reachable when switching
          firmware. The camera streams over Wi-Fi from Arduino IDE, and I tuned its angle, zoom and lighting.
        </p>
        {/* Capped at each source image's native width (252 px and 189 px) so they never upscale. */}
        <div className="flex flex-wrap items-start justify-center gap-6">
          <Figure src="/projects/sudoku/sketch.png" alt="Hand sketch of the rig with dimensions 13×13×12 studs" caption="Design sketch: 13 × 13 × 12 studs." className="w-full max-w-[252px]" />
          <Figure src="/projects/sudoku/lab-bench.jpg" alt="Laptop, oscilloscope and LEGO rig on a lab bench" caption="Testing on the lab bench." className="w-full max-w-[189px]" />
        </div>
      </Block>

      <Block title="Three stages of the model">
        <ol className="space-y-10">
          {stages.map((s) => (
            <li key={s.n} className="grid gap-5 md:grid-cols-[1.2fr_1fr]">
              <div>
                <p className="font-mono text-xs text-accent">{s.n}</p>
                <h3 className="mt-1 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-muted">{s.body}</p>
              </div>
              <Figure {...s.img} />
            </li>
          ))}
        </ol>
      </Block>

      <Block title="Takeaways & next steps">
        <ul className="list-disc space-y-2 pl-5">
          <li>On-device ML is limited by data conditions (lighting, scale, contrast) as much as by model choice.</li>
          <li>When a tool&apos;s ceiling became the bottleneck, I changed the toolchain instead of over-tuning.</li>
          <li>Next: train a stronger recognizer in Python with more data, scale from 3×3 to the full 9×9 grid, and harden the rig for everyday users.</li>
        </ul>
      </Block>
    </article>
  );
}
