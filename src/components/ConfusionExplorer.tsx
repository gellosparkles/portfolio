"use client";

import { useState } from "react";
import { ConfusionMatrix3D } from "./three/lazy";
import type { Cell } from "./three/ConfusionMatrix3D";
import { gestureClasses, gestureModels } from "@/content/gesture";

export default function ConfusionExplorer() {
  const [modelId, setModelId] = useState<(typeof gestureModels)[number]["id"]>("mobilenet");
  const [hovered, setHovered] = useState<Cell | null>(null);
  const model = gestureModels.find((m) => m.id === modelId)!;
  const total = model.confusion.flat().reduce((a, b) => a + b, 0);
  const correct = model.confusion.reduce((a, r, i) => a + r[i], 0);

  return (
    <div className="rounded-2xl border border-line bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4">
        <div role="tablist" aria-label="Model" className="flex gap-1 rounded-full bg-bg p-1">
          {gestureModels.map((m) => (
            <button
              key={m.id}
              role="tab"
              aria-selected={m.id === modelId}
              onClick={() => setModelId(m.id)}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                m.id === modelId ? "bg-accent text-bg" : "text-muted hover:text-fg"
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>
        <p className="font-mono text-sm text-muted">
          {correct}/{total} correct · <span className="text-fg">{model.accuracy.toFixed(2)}%</span>
        </p>
      </div>

      <div className="relative">
        <ConfusionMatrix3D
          matrix={model.confusion}
          hovered={hovered}
          onHover={setHovered}
          className="h-[360px] w-full sm:h-[440px]"
        />
        <div className="pointer-events-none absolute left-4 top-4 max-w-[16rem] rounded-lg bg-bg/85 px-3 py-2 text-sm backdrop-blur">
          {hovered ? (
            <>
              <p className="font-medium">
                {hovered.row === hovered.col ? "Correct" : "Confused"}: {hovered.count} clip
                {hovered.count === 1 ? "" : "s"}
              </p>
              <p className="text-muted">
                True <span className="text-fg">{gestureClasses[hovered.row]}</span> → predicted{" "}
                <span className="text-fg">{gestureClasses[hovered.col]}</span>
              </p>
            </>
          ) : (
            <p className="text-muted">
              Hover a bar to inspect it. Drag to rotate. <span className="text-accent">Blue</span> = correct,{" "}
              <span className="text-warn">orange</span> = mistakes.
            </p>
          )}
        </div>
      </div>

      <details className="border-t border-line p-4 text-sm">
        <summary className="cursor-pointer text-muted hover:text-fg">Per-class precision / recall / F1</summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[28rem] text-left font-mono text-xs">
            <thead className="text-muted">
              <tr>
                <th className="py-1 pr-4 font-normal">Class</th>
                <th className="py-1 pr-4 font-normal">Precision</th>
                <th className="py-1 pr-4 font-normal">Recall</th>
                <th className="py-1 pr-4 font-normal">F1</th>
                <th className="py-1 font-normal">Confusion row (pred. 0–4)</th>
              </tr>
            </thead>
            <tbody>
              {model.perClass.map((p, i) => (
                <tr key={i} className="border-t border-line">
                  <td className="py-1.5 pr-4 font-sans text-fg">{gestureClasses[i]}</td>
                  <td className="py-1.5 pr-4">{p.precision.toFixed(2)}</td>
                  <td className="py-1.5 pr-4">{p.recall.toFixed(2)}</td>
                  <td className="py-1.5 pr-4">{p.f1.toFixed(2)}</td>
                  <td className="py-1.5">[{model.confusion[i].join(", ")}]</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
