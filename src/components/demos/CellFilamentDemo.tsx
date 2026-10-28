"use client";

import { useState } from "react";

type Cell = { x: number; y: number; r: number; score: number; filament: boolean };

// Deterministic pseudo-random numbers so server and client render the same cells.
function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

const COLS = 8;
const ROWS = 4;

// Made-up cells on a jittered grid. Filament cells tend to score high, but the model is imperfect.
const CELLS: Cell[] = (() => {
  const rand = rng(7);
  const out: Cell[] = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const filament = rand() < 0.35;
      const score = filament ? 0.4 + rand() * 0.6 : rand() * 0.65;
      out.push({
        x: 30 + col * 50 + (rand() - 0.5) * 12,
        y: 30 + row * 50 + (rand() - 0.5) * 12,
        r: 15 + rand() * 4,
        score,
        filament,
      });
    }
  }
  return out;
})();

export default function CellFilamentDemo() {
  const [threshold, setThreshold] = useState(0.5);
  const flagged = CELLS.filter((c) => c.score >= threshold).length;
  const pct = Math.round((flagged / CELLS.length) * 100);

  return (
    <div>
      <svg
        viewBox="0 0 410 210"
        role="img"
        aria-label={`Made-up fluorescence image of ${CELLS.length} cells. ${flagged} are scored as containing filaments at threshold ${threshold.toFixed(2)}.`}
        className="h-auto w-full max-w-xl rounded-xl bg-[#0b1220]"
      >
        {CELLS.map((c, i) => {
          const hit = c.score >= threshold;
          return (
            <g key={i}>
              <circle cx={c.x} cy={c.y} r={c.r} fill="#1f6f5c" opacity="0.45" stroke={hit ? "#fbbf24" : "none"} strokeWidth="2" />
              {c.filament && (
                <path
                  d={`M${c.x - c.r * 0.6},${c.y - 2} Q${c.x},${c.y + 6} ${c.x + c.r * 0.6},${c.y - 3}`}
                  stroke="#9ff3c8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
              )}
            </g>
          );
        })}
      </svg>

      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        <label className="flex min-w-0 flex-1 items-center gap-3">
          <span className="shrink-0">Model threshold</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="min-w-0 flex-1 accent-accent"
          />
          <span className="w-10 shrink-0 font-mono text-xs">{threshold.toFixed(2)}</span>
        </label>
        <p aria-live="polite">
          <span className="text-2xl font-semibold text-accent">{pct}%</span>{" "}
          <span className="text-muted">of cells with filament</span>
        </p>
      </div>
      <p className="mt-2 text-xs text-muted">
        Synthetic cells, not real microscopy. Green strokes are filaments; gold rings are cells the model flags.
        Raising the threshold flags fewer cells.
      </p>
    </div>
  );
}
