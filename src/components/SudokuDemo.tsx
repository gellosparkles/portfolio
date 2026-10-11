"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SudokuBoard3D } from "./three/lazy";
import type { CellState } from "./three/SudokuBoard3D";
import { PUZZLES, parse, solveSteps, type Step } from "@/lib/sudoku";

const SPEEDS = [
  { label: "1×", stepsPerTick: 1, ms: 90 },
  { label: "4×", stepsPerTick: 1, ms: 22 },
  { label: "20×", stepsPerTick: 5, ms: 16 },
];

function fresh(puzzle: string): CellState[] {
  return parse(puzzle).map((v) => ({ value: v, given: v !== 0, flash: null }));
}

export default function SudokuDemo() {
  const [puzzle, setPuzzle] = useState(PUZZLES[2]);
  const [cells, setCells] = useState(() => fresh(PUZZLES[2].grid));
  const [speed, setSpeed] = useState(1);
  const [running, setRunning] = useState(false);
  const [stats, setStats] = useState({ places: 0, undos: 0, done: false });
  const gen = useRef<Generator<Step> | null>(null);

  const reset = useCallback((p = puzzle) => {
    gen.current = null;
    setRunning(false);
    setCells(fresh(p.grid));
    setStats({ places: 0, undos: 0, done: false });
  }, [puzzle]);

  useEffect(() => {
    if (!running) return;
    const { stepsPerTick, ms } = SPEEDS[speed];
    const id = setInterval(() => {
      if (!gen.current) return;
      const changes: Step[] = [];
      for (let i = 0; i < stepsPerTick; i++) {
        const r = gen.current.next();
        if (r.done) break;
        changes.push(r.value);
        if (r.value.kind === "done") break;
      }
      setCells((prev) => {
        const next = prev.slice();
        for (const s of changes)
          if (s.kind !== "done") next[s.cell] = { value: s.value, given: false, flash: s.kind };
        return next;
      });
      setStats((st) => {
        let { places, undos, done } = st;
        for (const s of changes) {
          if (s.kind === "place") places++;
          else if (s.kind === "undo") undos++;
          else done = true;
        }
        return { places, undos, done };
      });
      if (changes.some((s) => s.kind === "done")) setRunning(false);
    }, ms);
    return () => clearInterval(id);
  }, [running, speed]);

  const start = () => {
    if (stats.done) return;
    if (!gen.current) gen.current = solveSteps(parse(puzzle.grid));
    setRunning((r) => !r);
  };

  const btn = "rounded-full border border-line px-3 py-1.5 text-sm transition-colors hover:border-accent";

  return (
    <div className="rounded-2xl border border-line bg-surface">
      <div className="flex flex-wrap items-center gap-2 border-b border-line p-4">
        <button onClick={start} disabled={stats.done} className={`${btn} bg-accent text-bg disabled:opacity-50`}>
          {running ? "Pause" : stats.done ? "Solved" : stats.places ? "Resume" : "Solve"}
        </button>
        <button onClick={() => reset()} className={btn}>
          Reset
        </button>
        <span className="mx-1 h-5 w-px bg-line" />
        {PUZZLES.map((p) => (
          <button
            key={p.name}
            onClick={() => {
              setPuzzle(p);
              reset(p);
            }}
            aria-pressed={p.name === puzzle.name}
            className={`${btn} ${p.name === puzzle.name ? "border-accent text-accent" : "text-muted"}`}
          >
            {p.name}
          </button>
        ))}
        <span className="mx-1 h-5 w-px bg-line" />
        {SPEEDS.map((s, i) => (
          <button
            key={s.label}
            onClick={() => setSpeed(i)}
            aria-pressed={i === speed}
            className={`${btn} font-mono ${i === speed ? "border-accent text-accent" : "text-muted"}`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <SudokuBoard3D cells={cells} className="h-[380px] w-full sm:h-[460px]" />
      <p className="border-t border-line p-4 font-mono text-xs text-muted" aria-live="polite">
        placements <span className="text-fg">{stats.places}</span> · backtracks{" "}
        <span className="text-warn">{stats.undos}</span>
        {stats.done && <span className="text-accent"> · solved ✓</span>}
      </p>
    </div>
  );
}
