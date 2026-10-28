"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./hooks";

type Pt = { x: number; y: number };

const W = 480;
const H = 300;
const CLUSTER_END = 0.5; // progress at which dots have reached their hubs
const DURATION = 5500; // ms for the full play

// Seeded PRNG so the scatter, hubs and route are identical on every render.
function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

function dist(a: Pt, b: Pt) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// Rough positions on a simplified LA basin map (north up, not to scale).
const AREAS: (Pt & { name: string; sx: number; sy: number })[] = [
  { name: "Santa Monica", x: 78, y: 114, sx: 18, sy: 12 },
  { name: "Westwood", x: 112, y: 88, sx: 24, sy: 16 },
  { name: "Hollywood", x: 186, y: 78, sx: 34, sy: 18 },
  { name: "Downtown", x: 270, y: 120, sx: 34, sy: 28 },
  { name: "Pasadena", x: 362, y: 58, sx: 44, sy: 22 },
];
const K = AREAS.length;
const VENUE: Pt = { x: 186, y: 166 };

/** Made-up rider locations, grouped by plain k-means seeded at the five areas. */
function build() {
  const rand = rng(7);
  const dots: Pt[] = Array.from({ length: 70 }, (_, i) => {
    const c = AREAS[i % K];
    return { x: c.x + (rand() - 0.5) * c.sx * 2, y: c.y + (rand() - 0.5) * c.sy * 2 };
  });

  let hubs: Pt[] = AREAS.map(({ x, y }) => ({ x, y }));
  let assign: number[] = [];
  for (let it = 0; it < 10; it++) {
    assign = dots.map((d) => hubs.reduce((best, h, i) => (dist(d, h) < dist(d, hubs[best]) ? i : best), 0));
    hubs = hubs.map((h, i) => {
      const m = dots.filter((_, j) => assign[j] === i);
      return m.length ? { x: m.reduce((s, d) => s + d.x, 0) / m.length, y: m.reduce((s, d) => s + d.y, 0) / m.length } : h;
    });
  }

  // Route: start at the hub farthest from the venue, always visit the nearest unvisited hub, then drive to the venue.
  const rest = new Set(hubs.keys());
  const first = [...rest].reduce((b, i) => (dist(hubs[i], VENUE) > dist(hubs[b], VENUE) ? i : b));
  const order = [first];
  rest.delete(first);
  while (rest.size) {
    const last = hubs[order[order.length - 1]];
    const next = [...rest].reduce((b, i) => (dist(hubs[i], last) < dist(hubs[b], last) ? i : b));
    order.push(next);
    rest.delete(next);
  }
  return { dots, hubs, assign, route: [...order.map((i) => hubs[i]), VENUE] };
}

const { dots, hubs, assign, route } = build();
const segLens = route.slice(1).map((p, i) => dist(route[i], p));
const total = segLens.reduce((a, b) => a + b, 0);

/** Point a fraction f (0..1) of the way along the route. */
function along(f: number): Pt {
  let d = f * total;
  for (let i = 0; i < segLens.length; i++) {
    if (d <= segLens[i]) {
      const t = d / segLens[i];
      return { x: route[i].x + (route[i + 1].x - route[i].x) * t, y: route[i].y + (route[i + 1].y - route[i].y) * t };
    }
    d -= segLens[i];
  }
  return route[route.length - 1];
}

const ease = (t: number) => t * t * (3 - 2 * t);
const COLORS = ["var(--color-accent)", "#e0a030", "#c25a8a", "#4aa3a0", "#7a6fd0"];
const routePoints = route.map((p) => `${p.x},${p.y}`).join(" ");

export default function HubRouteDemo({ active }: { active: boolean }) {
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const from = useRef(0);

  useEffect(() => {
    if (!playing || !active || reduced) return;
    let raf = 0;
    let start: number | null = null;
    const tick = (now: number) => {
      start ??= now - from.current * DURATION;
      const p = Math.min(1, (now - start) / DURATION);
      from.current = p;
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setPlaying(false);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, active, reduced]);

  // Reduced motion shows the finished state and never animates.
  const p = reduced ? 1 : progress;
  const move = ease(Math.min(1, p / CLUSTER_END));
  const clustered = p > 0;
  const routeP = Math.max(0, (p - CLUSTER_END) / (1 - CLUSTER_END));
  const bus = along(routeP);

  const play = () => {
    from.current = 0;
    setProgress(0);
    setPlaying(true);
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 sm:flex-row sm:items-start sm:justify-center">
      <div className="w-full max-w-xl">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label="Simplified map of the Los Angeles area. Scattered rider dots group into five hubs, then one bus route picks up at each hub and ends at the event venue."
          className="h-auto w-full rounded-xl border border-line bg-bg text-fg"
        >
          <BasinMap />

          {routeP > 0 && (
            <polyline
              points={routePoints}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - routeP}
              fill="none"
              className="stroke-accent"
              strokeWidth="4"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}

          {clustered &&
            hubs.map((h, i) => (
              <circle key={i} cx={h.x} cy={h.y} r="14" fill="none" style={{ stroke: COLORS[i] }} strokeWidth="2" opacity={move} />
            ))}

          {dots.map((d, i) => {
            const h = hubs[assign[i]];
            const x = d.x + (h.x + (d.x - h.x) * 0.12 - d.x) * move;
            const y = d.y + (h.y + (d.y - h.y) * 0.12 - d.y) * move;
            return <circle key={i} cx={x} cy={y} r="3.5" style={{ fill: clustered ? COLORS[assign[i]] : "currentColor" }} opacity={clustered ? 0.9 : 0.55} />;
          })}

          <g>
            <circle cx={VENUE.x} cy={VENUE.y} r="9" className="fill-fg" />
            <path d={`M${VENUE.x - 4},${VENUE.y} l3,3 l5,-6`} className="stroke-bg" strokeWidth="2" fill="none" />
            <text x={VENUE.x + 13} y={VENUE.y + 4} fontSize="11" fontWeight="600" className="fill-current">
              Venue
            </text>
          </g>

          {routeP > 0 && <rect x={bus.x - 10} y={bus.y - 6} width="20" height="12" rx="3" className="fill-accent stroke-bg" strokeWidth="2" />}
        </svg>

        <div className="mt-3 flex items-center gap-3 text-sm">
          {!reduced && (
            <button
              type="button"
              onClick={play}
              disabled={playing}
              className="rounded-full bg-accent px-3 py-1 font-medium text-bg disabled:opacity-60"
            >
              {playing ? "Playing…" : p >= 1 ? "Replay" : "Play"}
            </button>
          )}
          <p aria-live="polite" className="text-muted">
            {p >= 1 ? "5 pickup hubs, one bus route, straight to the venue." : "Riders start scattered across the city."}
          </p>
        </div>
      </div>

      <p className="w-fit rounded-xl border border-line bg-surface px-4 py-3 text-sm">
        <span className="block text-2xl font-semibold text-accent">$15</span>
        <span className="text-muted">vs $31–62 Uber</span>
      </p>
    </div>
  );
}

const FREEWAYS: { n: string; d: string; at: Pt }[] = [
  { n: "10", d: "M50,124 L130,116 L262,112 L480,104", at: { x: 160, y: 115 } },
  { n: "405", d: "M96,0 L94,96 L112,140 L136,172 L172,214 L300,250 L480,286", at: { x: 104, y: 124 } },
  { n: "110", d: "M262,112 L240,142 L232,200 L230,286 M262,112 L300,86 L346,58", at: { x: 234, y: 230 } },
  { n: "101", d: "M120,0 L150,44 L192,82 L262,112", at: { x: 150, y: 44 } },
  { n: "5", d: "M196,0 L240,58 L266,108 L480,206", at: { x: 380, y: 160 } },
  { n: "210", d: "M300,26 L358,52 L480,58", at: { x: 430, y: 56 } },
  { n: "105", d: "M126,174 L392,184", at: { x: 320, y: 181 } },
  { n: "710", d: "M314,262 L306,112", at: { x: 310, y: 215 } },
];

/** Simplified LA basin: Santa Monica Bay and the coast to Long Beach, the hills, and the main freeways. */
function BasinMap() {
  return (
    <g>
      {/* Santa Monica Mountains and San Gabriel foothills */}
      <path d="M0,70 Q60,58 120,66 Q180,52 230,62 L232,74 Q170,80 120,84 Q60,92 0,100 Z" className="fill-line" opacity="0.6" />
      <path d="M280,0 L480,0 L480,34 Q420,30 360,22 Q320,14 280,0 Z" className="fill-line" opacity="0.6" />
      {/* Pacific Ocean */}
      <path
        d="M0,116 L52,128 Q64,134 70,142 L76,152 Q100,168 114,182 L124,200 L140,218 Q120,236 112,256 Q118,276 132,282 Q180,292 228,290 L262,272 L314,264 L360,272 L394,280 L480,300 L0,300 Z"
        className="fill-accent-soft"
        opacity="0.6"
      />
      <text x="40" y="236" fontSize="10" letterSpacing="2" className="fill-muted">
        PACIFIC
      </text>
      <g className="stroke-line" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round">
        {FREEWAYS.map((f) => (
          <path key={f.n} d={f.d} />
        ))}
      </g>
      {FREEWAYS.map((f) => (
        <g key={f.n}>
          <rect x={f.at.x - 9} y={f.at.y - 6} width="18" height="12" rx="3" className="fill-bg stroke-line" />
          <text x={f.at.x} y={f.at.y + 3} textAnchor="middle" fontSize="7.5" className="fill-muted font-mono">
            {f.n}
          </text>
        </g>
      ))}
      <text x="96" y="186" fontSize="9" className="fill-muted">
        LAX
      </text>
      <text x="300" y="282" fontSize="9" className="fill-muted">
        Long Beach
      </text>
      {AREAS.map((a) => (
        <text key={a.name} x={a.x} y={a.y - a.sy - 4} textAnchor="middle" fontSize="9.5" className="fill-muted">
          {a.name}
        </text>
      ))}
    </g>
  );
}
