import type { Metadata } from "next";
import ConfusionExplorer from "@/components/ConfusionExplorer";
import { Block, CaseStudyHeader, Pipeline } from "@/components/CaseStudy";
import { Figure } from "@/components/Section";
import { gestureModels } from "@/content/gesture";
import { publications } from "@/content/site";

export const metadata: Metadata = {
  title: "Dynamic Hand-Gesture Recognition",
  description:
    "MobileNet + GRU model for video hand-gesture recognition: 85% test accuracy versus 66% for an RNN + GRU baseline.",
};

const paper = publications[0];

export default function GesturePage() {
  const [ours, baseline] = gestureModels;
  return (
    <article>
      <CaseStudyHeader
        kicker="Research · Chang Gung University Intelligent Control Lab · Aug 2024 – Jun 2025"
        title="Dynamic Hand-Gesture Recognition with MobileNet + GRU"
        lede="Static gesture classifiers look at one frame at a time, so they can't tell a left swipe from a right swipe. This model reads the whole clip. A pre-trained MobileNet extracts what each frame shows, and a GRU learns how it moves."
        facts={[
          ["Test accuracy", "85%"],
          ["Baseline (RNN + GRU)", "66%"],
          ["Test loss", `${ours.loss} vs ${baseline.loss}`],
          ["Presented", "Poster, 20th Formosa Plastics Applied Tech. Seminar"],
        ]}
      />

      <Block title="Results: explore the confusion matrices">
        <p className="text-muted">
          These are the real test-set results from the paper. Switch models to see where the baseline breaks down.
          It mixes up the swipes and pauses, while MobileNet + GRU&apos;s only real weakness is left swipes.
        </p>
        <ConfusionExplorer />
      </Block>

      <Block title="Approach">
        <Pipeline
          steps={[
            { name: "Frames", detail: "Each 30-frame clip trimmed to frames 7–26 and downsampled to 96×96." },
            { name: "MobileNet", detail: "Pre-trained CNN, wrapped in TimeDistributed, extracts spatial features per frame." },
            { name: "Compress", detail: "Pooling halves height and width, then features are flattened per time step." },
            { name: "GRU (128)", detail: "Models temporal order. Dropout of 0.3 limits overfitting." },
            { name: "Softmax", detail: "Five classes: left/right swipe, pause, thumbs down/up." },
          ]}
        />
        <p>
          <strong>Why this design:</strong> transfer learning from MobileNet gives strong spatial features without a
          large dataset, and MobileNet is light enough to point toward real-time, on-device use. GRUs capture
          temporal dependencies with fewer parameters than LSTMs and avoid the vanishing gradients of plain RNNs.
        </p>
        <p>
          <strong>No data augmentation, on purpose:</strong> flipping or reversing a clip would turn a left swipe into
          a right swipe. Direction is the label.
        </p>
      </Block>

      <Block title="Data & training">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Open Kaggle dataset (<em>Hand Gesture Detection System</em>): 763 clips, each 30 frames covering 2–3
            seconds, recorded waist-up.
          </li>
          <li>Roughly 84 / 12 / 4% train / validation / test split, randomized and balanced across classes, with early stopping on validation.</li>
          <li>
            <strong>Optuna</strong> Bayesian search (Tree-structured Parzen Estimator), 50 trials, picked: GRU 128
            units, dense 64 units, learning rate 0.001.
          </li>
          <li>Cross-entropy loss, batch size 32, trained on an NVIDIA RTX 4060 in about 15 minutes.</li>
        </ul>
        <div className="grid gap-6 pt-2 sm:grid-cols-2">
          <Figure
            src="/projects/gesture/mobilenet-accuracy.png"
            alt="MobileNet+GRU training and validation accuracy rising to about 0.95 over 30 epochs"
            caption="MobileNet + GRU accuracy: train and validation track closely."
          />
          <Figure
            src="/projects/gesture/rnn-accuracy.png"
            alt="RNN+GRU accuracy curves with a large, noisy gap between training and validation"
            caption="RNN + GRU baseline: a noisy validation curve and a persistent gap from training."
          />
          <Figure
            src="/projects/gesture/mobilenet-loss.png"
            alt="MobileNet+GRU loss curves converging"
            caption="MobileNet + GRU loss."
          />
          <Figure
            src="/projects/gesture/rnn-loss.png"
            alt="RNN+GRU loss curves with large validation spikes"
            caption="RNN + GRU loss: validation spikes early in training."
          />
        </div>
      </Block>

      <Block title="What I'd do next">
        <ul className="list-disc space-y-2 pl-5">
          <li>Evaluate on a larger held-out set. 32 test clips make each mistake worth about 3 points of accuracy.</li>
          <li>Try temporal augmentation that keeps direction (speed jitter, crops) and Transformer-based temporal models.</li>
          <li>Swap in MobileNetV3 and quantize for real-time inference on a phone.</li>
        </ul>
      </Block>

      <Block title="Paper">
        <div className="rounded-2xl border border-line bg-surface p-5 text-sm">
          <p className="font-medium">{paper.title}</p>
          <p className="mt-1 text-muted">{paper.authors.join(", ")}</p>
          <p className="mt-1 italic text-muted">{paper.venue}</p>
          <p className="mt-3 text-muted">
            Affiliations: Chang Gung University, Dept. of Electrical Engineering; Kang Chiao International School.
          </p>
          {paper.paperPdf && (
            <a href={paper.paperPdf} className="mt-3 inline-block font-medium text-accent">
              Read the full paper (PDF) →
            </a>
          )}
        </div>
      </Block>
    </article>
  );
}
