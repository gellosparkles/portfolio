"use client";

import Link from "next/link";
import { gestureClasses, gestureModels } from "@/content/gesture";
import { PUZZLES, parse } from "@/lib/sudoku";

const matrix = gestureModels[0].confusion;
const maxCount = Math.max(...matrix.flat());
const givens = parse(PUZZLES[0].grid);

function MiniMatrix() {
  const cell = 20;
  return (
    <svg viewBox="0 0 100 100" className="mx-auto h-32 w-32" role="img" aria-label="5 by 5 confusion matrix with most counts on the diagonal">
      {matrix.map((row, r) =>
        row.map((n, c) => (
          <rect
            key={`${r}-${c}`}
            x={c * cell + 1}
            y={r * cell + 1}
            width={cell - 2}
            height={cell - 2}
            rx={2}
            className={r === c ? "fill-accent" : n > 0 ? "fill-warn" : "fill-line"}
            opacity={n === 0 ? 0.35 : 0.35 + 0.65 * (n / maxCount)}
          />
        )),
      )}
    </svg>
  );
}

function MiniBoard() {
  const cell = 100 / 9;
  return (
    <svg viewBox="0 0 100 100" className="mx-auto h-32 w-32" role="img" aria-label="Sudoku board with the given digits filled in">
      <rect x={0} y={0} width={100} height={100} rx={3} className="fill-bg stroke-line" />
      {givens.map((v, i) => {
        const x = (i % 9) * cell;
        const y = Math.floor(i / 9) * cell;
        return (
          <g key={i}>
            <rect x={x} y={y} width={cell} height={cell} className="fill-none stroke-line" strokeWidth={0.3} />
            {v !== 0 && (
              <text x={x + cell / 2} y={y + cell / 2 + 3} textAnchor="middle" fontSize={8} className="fill-fg font-mono">
                {v}
              </text>
            )}
          </g>
        );
      })}
      {[3, 6].map((k) => (
        <g key={k} className="stroke-accent" strokeWidth={0.8}>
          <line x1={k * cell} y1={0} x2={k * cell} y2={100} />
          <line x1={0} y1={k * cell} x2={100} y2={k * cell} />
        </g>
      ))}
    </svg>
  );
}

const tile = "block rounded-xl border border-line bg-bg p-4 transition-colors hover:border-accent";

/**
 * Static thumbnails, each linking to its case study. No animation, so `active` is unused.
 * `preview` drops the links so the thumbnails can sit inside another link.
 */
export default function CaseStudyThumbsDemo({ preview }: { active: boolean; preview?: boolean }) {
  const Tile = preview ? "div" : Link;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Tile href="/projects/gesture-recognition" className={tile}>
        <MiniMatrix />
        <p className="mt-3 text-sm font-medium">Gesture recognition →</p>
        <p className="text-xs text-muted">{gestureClasses.length}-class confusion matrix, in 3D.</p>
      </Tile>
      <Tile href="/projects/sudoku-solver" className={tile}>
        <MiniBoard />
        <p className="mt-3 text-sm font-medium">ML Sudoku solver →</p>
        <p className="text-xs text-muted">ESP32-CAM digit reader and solver.</p>
      </Tile>
    </div>
  );
}
