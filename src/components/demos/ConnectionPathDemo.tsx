"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./hooks";

type Mode = "direct" | "turn";

// Video flows from the Pi to the browser. Coordinates match the nodes drawn below.
const MODES: Record<Mode, { label: string; path: string; caption: string }> = {
  direct: {
    label: "Direct (STUN)",
    path: "M420,170 L240,170 L60,170",
    caption:
      "Direct: both sides ask the STUN server for their public address, then video flows peer-to-peer from the Pi to the browser.",
  },
  turn: {
    label: "TURN fallback",
    path: "M420,170 L240,60 L240,170 L60,170",
    caption:
      "TURN fallback: when the NAT blocks a direct path, the TURN server relays the video, adding a hop.",
  },
};

const PACKETS = [0, 1, 2];
const DURATION = 3;

export default function ConnectionPathDemo({ active }: { active: boolean }) {
  const [mode, setMode] = useState<Mode>("direct");
  const reduced = useReducedMotion();
  const svg = useRef<SVGSVGElement>(null);
  const { path, caption } = MODES[mode];
  const relayed = mode === "turn";

  // Freeze SMIL animation while the card is off screen.
  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    if (active && !reduced) el.unpauseAnimations();
    else el.pauseAnimations();
  }, [active, reduced, mode]);

  return (
    <div>
      <div role="group" aria-label="Connection type" className="mb-3 flex flex-wrap gap-2 text-sm">
        {(Object.keys(MODES) as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={mode === m}
            onClick={() => setMode(m)}
            className={
              mode === m
                ? "rounded-full bg-accent px-3 py-1 font-medium text-bg"
                : "rounded-full border border-line px-3 py-1 hover:border-accent"
            }
          >
            {MODES[m].label}
          </button>
        ))}
      </div>

      <svg
        ref={svg}
        viewBox="0 0 480 220"
        role="img"
        aria-label={`Diagram: Raspberry Pi 5 to browser, ${relayed ? "relayed through a TURN server" : "direct through NAT using STUN"}.`}
        className="h-auto w-full max-w-xl text-fg"
      >
        {/* STUN: both peers learn their public address (always used, drawn faint) */}
        <g className="stroke-muted" strokeWidth="1" strokeDasharray="3 4" fill="none" opacity={relayed ? 0.25 : 0.6}>
          <path d="M60,170 L240,60" />
          <path d="M420,170 L240,60" />
        </g>
        {/* Active path */}
        <path d={path} fill="none" className="stroke-accent" strokeWidth="3" strokeLinejoin="round" opacity="0.35" />

        <Node x={60} y={170} label="Browser" />
        <Node x={240} y={170} label="NAT / firewall" />
        <Node x={420} y={170} label="Raspberry Pi 5" />
        <Node x={240} y={60} label={relayed ? "TURN server" : "STUN server"} accent={relayed} />

        {/* Reduced motion: the highlighted path is the still state, no packets */}
        {!reduced &&
          PACKETS.map((i) => (
            <circle key={`${mode}-${i}`} r="6" className="fill-accent">
              <animateMotion
                dur={`${DURATION}s`}
                begin={`${(i * DURATION) / PACKETS.length}s`}
                repeatCount="indefinite"
                path={path}
              />
            </circle>
          ))}
      </svg>

      <p aria-live="polite" className="mt-3 text-sm leading-relaxed text-muted">
        {caption}
      </p>
    </div>
  );
}

function Node({ x, y, label, accent }: { x: number; y: number; label: string; accent?: boolean }) {
  return (
    <g>
      <rect
        x={x - 52}
        y={y - 20}
        width="104"
        height="40"
        rx="10"
        className={accent ? "fill-accent-soft stroke-accent" : "fill-surface stroke-line"}
        strokeWidth="1.5"
      />
      <text x={x} y={y + 5} textAnchor="middle" fontSize="13" className="fill-current">
        {label}
      </text>
    </g>
  );
}
