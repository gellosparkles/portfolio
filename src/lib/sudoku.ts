// Backtracking Sudoku solver with the minimum-remaining-values heuristic,
// written as a generator so the 3D board can animate every step.

export type Grid = number[]; // 81 cells, 0 = empty
export type Step = { kind: "place" | "undo"; cell: number; value: number } | { kind: "done"; solved: boolean };

export const PUZZLES: { name: string; grid: string }[] = [
  { name: "Classic", grid: "530070000600195000098000060800060003400803001700020006060000280000419005000080079" },
  { name: "Medium", grid: "000260701680070090190004500820100040004602900050003028009300074040050036703018000" },
  { name: "Hard", grid: "000000907000420180000705026100904000050000040000507009920108000034059000507000000" },
];

export function parse(s: string): Grid {
  return s.split("").map(Number);
}

function candidates(g: Grid, cell: number): number[] {
  const r = Math.floor(cell / 9);
  const c = cell % 9;
  const used = new Set<number>();
  for (let i = 0; i < 9; i++) {
    used.add(g[r * 9 + i]);
    used.add(g[i * 9 + c]);
  }
  const br = r - (r % 3);
  const bc = c - (c % 3);
  for (let dr = 0; dr < 3; dr++) for (let dc = 0; dc < 3; dc++) used.add(g[(br + dr) * 9 + bc + dc]);
  const out: number[] = [];
  for (let v = 1; v <= 9; v++) if (!used.has(v)) out.push(v);
  return out;
}

/** The empty cell with the fewest legal values, or -1 when the grid is full. */
function mostConstrained(g: Grid): { cell: number; options: number[] } {
  let best = -1;
  let bestOpts: number[] = [];
  for (let i = 0; i < 81; i++) {
    if (g[i] !== 0) continue;
    const opts = candidates(g, i);
    if (best === -1 || opts.length < bestOpts.length) {
      best = i;
      bestOpts = opts;
      if (opts.length <= 1) break;
    }
  }
  return { cell: best, options: bestOpts };
}

export function* solveSteps(start: Grid): Generator<Step> {
  const g = start.slice();
  function* rec(): Generator<Step, boolean> {
    const { cell, options } = mostConstrained(g);
    if (cell === -1) return true;
    for (const v of options) {
      g[cell] = v;
      yield { kind: "place", cell, value: v };
      if (yield* rec()) return true;
      g[cell] = 0;
      yield { kind: "undo", cell, value: 0 };
    }
    return false;
  }
  const solved = yield* rec();
  yield { kind: "done", solved };
}
