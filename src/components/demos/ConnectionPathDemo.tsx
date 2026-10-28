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
    <div className="mx-auto max-w-4xl">
      <div role="group" aria-label="Connection type" className="mb-3 flex flex-wrap justify-center gap-2 text-sm">
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

      <div className="grid items-center gap-6 md:grid-cols-[1.2fr_1fr]">
      <svg
        ref={svg}
        viewBox="0 0 480 220"
        role="img"
        aria-label={`Diagram: Raspberry Pi 5 to browser, ${relayed ? "relayed through a TURN server" : "direct through NAT using STUN"}.`}
        className="h-auto w-full text-fg"
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
      <Viewer relayed={relayed} active={active} reduced={reduced} />
      </div>

      <p aria-live="polite" className="mt-3 text-center text-sm leading-relaxed text-muted">
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

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const ctrl = "rounded-full border border-line px-2.5 py-0.5 hover:border-accent disabled:opacity-50";
const PAN: [string, number, number, string][] = [
  ["Pan left", -1, 0, "←"],
  ["Tilt up", 0, -1, "↑"],
  ["Center camera", 0, 0, "⌂"],
  ["Tilt down", 0, 1, "↓"],
  ["Pan right", 1, 0, "→"],
];

/** Mock of the browser page a user opens to watch the Pi's webcam. The "video" is a drawn scene, not a real feed. */
function Viewer({ relayed, active, reduced }: { relayed: boolean; active: boolean; reduced: boolean }) {
  const [stopped, setStopped] = useState(false);
  const [readyFor, setReadyFor] = useState<boolean | null>(null);
  const [now, setNow] = useState(() => new Date());
  const scene = useRef<SVGSVGElement>(null);

  // Negotiate again whenever the path changes; "connecting" lasts until the timer marks this path ready.
  useEffect(() => {
    const t = setTimeout(() => setReadyFor(relayed), reduced ? 0 : 1100);
    return () => clearTimeout(t);
  }, [relayed, reduced]);
  const state = stopped ? "idle" : readyFor === relayed ? "live" : "connecting";

  const live = state === "live";
  useEffect(() => {
    if (!live || !active) return;
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, [live, active]);

  useEffect(() => {
    const el = scene.current;
    if (!el) return;
    if (live && active && !reduced) el.unpauseAnimations();
    else el.pauseAnimations();
  }, [live, active, reduced]);

  // Pan/tilt: the scene is drawn 1.25x larger than the frame, so the camera can look around inside it.
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [recFrom, setRecFrom] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const notify = (msg: string) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1800);
  };
  const stamp = () => new Date().toLocaleTimeString([], { hour12: false }).replaceAll(":", "");

  const toggle = () => {
    setStopped((s) => !s);
    setRecFrom(null);
  };
  const snapshot = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 150);
    notify(`Saved snapshot_${stamp()}.jpg`);
  };
  const record = () => {
    if (recFrom === null) setRecFrom(Date.now());
    else {
      notify(`Saved clip_${stamp()}.webm`);
      setRecFrom(null);
    }
  };
  const move = (dx: number, dy: number) =>
    setPan((p) => (dx === 0 && dy === 0 ? { x: 0, y: 0 } : { x: clamp(p.x + dx, -2, 2), y: clamp(p.y + dy, -2, 2) }));

  const recording = live && recFrom !== null;
  const recSecs = recording ? Math.max(0, Math.floor((now.getTime() - recFrom) / 1000)) : 0;

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-sm">
      <div className="flex items-center gap-2 border-b border-line px-3 py-2">
        <span className="flex gap-1" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-2 w-2 rounded-full bg-line" />
          ))}
        </span>
        <span className="flex-1 truncate rounded-md bg-bg px-2 py-0.5 font-mono text-[11px] text-muted">pi-cam.example/view</span>
      </div>

      <div className="relative aspect-video bg-[#101418]">
        <svg ref={scene} viewBox="0 0 320 180" className="absolute inset-0 h-full w-full" aria-hidden>
          <g
            style={{
              transform: `translate(${-40 - pan.x * 20}px, ${-22.5 - pan.y * 11}px) scale(1.25)`,
              transition: reduced ? undefined : "transform 400ms ease",
            }}
          >
          {/* a window with a passing cloud, a desk and a plant */}
          <rect x="190" y="22" width="100" height="78" rx="3" fill="#2b3a4a" />
          <g opacity="0.8">
            <ellipse cx="0" cy="48" rx="16" ry="7" fill="#c9d4de">
              <animateTransform attributeName="transform" type="translate" from="180 0" to="310 0" dur="14s" repeatCount="indefinite" />
            </ellipse>
          </g>
          <rect x="188" y="20" width="104" height="82" rx="4" fill="none" stroke="#3a4450" strokeWidth="4" />
          <line x1="240" y1="20" x2="240" y2="102" stroke="#3a4450" strokeWidth="3" />
          <rect x="0" y="128" width="320" height="52" fill="#262019" />
          <rect x="44" y="104" width="22" height="24" rx="3" fill="#7a4a32" />
          <path d="M55,104 Q40,80 48,66 M55,104 Q58,76 70,70 M55,104 Q66,90 80,88" stroke="#4f7a4a" strokeWidth="5" fill="none" strokeLinecap="round" />
          <rect x="110" y="112" width="60" height="16" rx="2" fill="#3a3f46" />
          <circle cx="160" cy="120" r="2" fill="#4ade80">
            <animate attributeName="opacity" values="1;0.2;1" dur="1.6s" repeatCount="indefinite" />
          </circle>
          </g>
        </svg>

        {state !== "live" && (
          <div className="absolute inset-0 grid place-items-center bg-[#101418]/85 font-mono text-xs text-[#c9d4de]">
            {state === "connecting" ? "Connecting… gathering ICE candidates" : "Stream stopped"}
          </div>
        )}
        {live && (
          <>
            <span className="absolute left-2 top-2 rounded bg-[#dc2626] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-white">
              {recording ? `● REC ${Math.floor(recSecs / 60)}:${String(recSecs % 60).padStart(2, "0")}` : "● LIVE"}
            </span>
            <span className="absolute bottom-2 right-2 rounded bg-black/50 px-1.5 py-0.5 font-mono text-[10px] text-white">
              {now.toLocaleTimeString([], { hour12: false })}
            </span>
          </>
        )}
        {flash && <div className="absolute inset-0 bg-white/80" />}
        {toast && (
          <span role="status" className="absolute bottom-2 left-2 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[10px] text-white">
            {toast}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-3 py-2 text-xs">
        <div className="flex gap-1.5">
          <button type="button" onClick={snapshot} disabled={!live} className={ctrl}>
            Snapshot
          </button>
          <button type="button" onClick={record} disabled={!live} aria-pressed={recording} className={`${ctrl} ${recording ? "border-[#dc2626] text-[#dc2626]" : ""}`}>
            {recording ? "■ Stop" : "● Record"}
          </button>
        </div>
        <div role="group" aria-label="Camera movement" className="flex gap-1">
          {PAN.map(([label, dx, dy, glyph]) => (
            <button key={label} type="button" onClick={() => move(dx, dy)} disabled={!live} aria-label={label} title={label} className={`${ctrl} w-7 px-0 text-center`}>
              {glyph}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-xs">
        <span className="flex items-center gap-1.5 text-muted">
          <span className={`h-2 w-2 rounded-full ${live ? (relayed ? "bg-warn" : "bg-accent") : "bg-line"}`} />
          {live ? (relayed ? "Relayed via TURN" : "Peer-to-peer, direct") : state === "connecting" ? "Negotiating" : "Disconnected"}
        </span>
        <span className="font-mono text-muted">Pi 5 · USB webcam</span>
        <button type="button" onClick={toggle} disabled={state === "connecting"} className="rounded-full border border-line px-2.5 py-0.5 hover:border-accent disabled:opacity-50">
          {state === "idle" ? "Connect" : "Disconnect"}
        </button>
      </div>
    </div>
  );
}
