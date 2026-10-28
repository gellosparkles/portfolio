"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./hooks";

type Pt = { x: number; y: number };

const W = 480;
const H = 300;
const K = 4;
const CLUSTER_END = 0.5; // progress at which dots have reached their hubs
const DURATION = 4500; // ms for the full play

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

/** Made-up rider locations, grouped by plain k-means with fixed starting centers. */
function build() {
  const rand = rng(7);
  const seeds: Pt[] = [
    { x: 150, y: 90 },
    { x: 330, y: 70 },
    { x: 380, y: 210 },
    { x: 200, y: 230 },
  ];
  const dots: Pt[] = Array.from({ length: 56 }, (_, i) => {
    const c = seeds[i % K];
    return { x: c.x + (rand() - 0.5) * 120, y: c.y + (rand() - 0.5) * 90 };
  });

  let hubs = seeds.map((s) => ({ ...s }));
  let assign: number[] = [];
  for (let it = 0; it < 10; it++) {
    assign = dots.map((d) => hubs.reduce((best, h, i) => (dist(d, h) < dist(d, hubs[best]) ? i : best), 0));
    hubs = hubs.map((h, i) => {
      const m = dots.filter((_, j) => assign[j] === i);
      return m.length ? { x: m.reduce((s, d) => s + d.x, 0) / m.length, y: m.reduce((s, d) => s + d.y, 0) / m.length } : h;
    });
  }

  // Route: start at the westernmost hub, then always visit the nearest unvisited one.
  const left = [...hubs.keys()].sort((a, b) => hubs[a].x - hubs[b].x);
  const order = [left[0]];
  const rest = new Set(left.slice(1));
  while (rest.size) {
    const last = hubs[order[order.length - 1]];
    const next = [...rest].reduce((b, i) => (dist(hubs[i], last) < dist(hubs[b], last) ? i : b));
    order.push(next);
    rest.delete(next);
  }
  return { dots, hubs, assign, route: order.map((i) => hubs[i]) };
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
const COLORS = ["var(--color-accent)", "#e0a030", "#c25a8a", "#4aa3a0"];
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
    <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
      <div>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label="Stylized Los Angeles map. Scattered rider dots group into four hubs, then a bus route connects the hubs."
          className="h-auto w-full max-w-xl rounded-xl border border-line bg-bg text-fg"
        >
          {/* Stylized map: ocean, coastline and a couple of freeways. Not to scale. */}
          <path d="M0,0 L70,0 Q95,80 60,150 Q30,220 70,300 L0,300 Z" className="fill-accent-soft" opacity="0.5" />
          <g className="stroke-line" strokeWidth="2" fill="none">
            <path d="M90,40 L480,120" />
            <path d="M80,260 L480,190" />
            <path d="M270,0 L300,300" />
          </g>

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
            {p >= 1 ? "Riders grouped into 4 hubs; one bus route serves them all." : "Riders start scattered across the city."}
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
