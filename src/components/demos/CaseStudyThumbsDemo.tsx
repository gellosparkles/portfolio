"use client";

import Link from "next/link";
import { gestureClasses, gestureModels } from "@/content/gesture";
import { PUZZLES, parse, solveSteps } from "@/lib/sudoku";
import { useClock, useReducedMotion } from "./hooks";

const matrix = gestureModels[0].confusion;
const maxCount = Math.max(...matrix.flat());
const givens = parse(PUZZLES[0].grid);

// The solver's placements in the order it settled them, replayed by the board thumbnail.
const fills = (() => {
  const g = givens.slice();
  for (const s of solveSteps(givens)) if (s.kind !== "done") g[s.cell] = s.value;
  return g.map((v, i) => ({ i, v })).filter(({ i }) => givens[i] === 0);
})();
const FILL_MS = 70; // per digit
const BOARD_LOOP = fills.length * FILL_MS + 2500;

function MiniMatrix({ t }: { t: number }) {
  const cell = 20;
  // A highlight sweeps down the diagonal, the way the 3D matrix lights a predicted class.
  const lit = Math.floor(t / 600) % matrix.length;
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
            style={{ transition: "transform 300ms ease", transformBox: "fill-box", transformOrigin: "center", transform: t && r === lit ? "scale(0.82)" : undefined }}
          />
        )),
      )}
    </svg>
  );
}

function MiniBoard({ t }: { t: number }) {
  const cell = 100 / 9;
  const solved = new Map(fills.slice(0, t ? Math.floor((t % BOARD_LOOP) / FILL_MS) : 0).map(({ i, v }) => [i, v]));
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
            {solved.has(i) && (
              <text x={x + cell / 2} y={y + cell / 2 + 3} textAnchor="middle" fontSize={8} className="fill-accent font-mono font-semibold">
                {solved.get(i)}
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
 * Thumbnails, each linking to its case study. While `active` the matrix sweeps its diagonal and the board solves itself on a loop.
 * `preview` drops the links so the thumbnails can sit inside another link.
 */
export default function CaseStudyThumbsDemo({ active, preview }: { active: boolean; preview?: boolean }) {
  const reduced = useReducedMotion();
  const t = useClock(active && !reduced);
  const Tile = preview ? "div" : Link;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Tile href="/projects/gesture-recognition" className={tile}>
        <MiniMatrix t={t} />
        <p className="mt-3 text-sm font-medium">Gesture recognition →</p>
        <p className="text-xs text-muted">{gestureClasses.length}-class confusion matrix, in 3D.</p>
      </Tile>
      <Tile href="/projects/sudoku-solver" className={tile}>
        <MiniBoard t={t} />
        <p className="mt-3 text-sm font-medium">ML Sudoku solver →</p>
        <p className="text-xs text-muted">ESP32-CAM digit reader and solver.</p>
      </Tile>
    </div>
  );
}
