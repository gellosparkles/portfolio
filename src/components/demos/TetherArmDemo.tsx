"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";
import CanvasShell, { readCssColor, useMotionAllowed } from "../three/CanvasShell";

type Mode = "pointer" | "sliders";

const JOINTS = 7; // joint 0 is the base yaw; joints 1–6 pitch in the arm's vertical plane
const LINK = 0.55;
const BASE_Y = 0.3;
const PITCH_LIMIT = 1.2; // rad, per joint
const REST: number[] = [0, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25];

// Motor groups share a driver: shoulder (0–1), elbow (2–4), wrist (5–6).
const GROUP_OF = [0, 0, 1, 1, 1, 2, 2];
const GROUPS = [
  { name: "Shoulder", joints: "J1–J2" },
  { name: "Elbow", joints: "J3–J5" },
  { name: "Wrist", joints: "J6–J7" },
];

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** Tip position in the arm's vertical plane (r outward, y up) for relative pitch angles pitch[1..6]. */
function planarTip(angles: number[]) {
  let r = 0;
  let y = BASE_Y;
  let phi = 0;
  for (let i = 1; i < JOINTS; i++) {
    phi += angles[i];
    r += Math.sin(phi) * LINK;
    y += Math.cos(phi) * LINK;
  }
  return { r, y };
}

/** One cyclic-coordinate-descent sweep: rotate each pitch joint, tip-ward last, so the tip nears (tr, ty). */
function ccdSweep(angles: number[], tr: number, ty: number) {
  for (let j = JOINTS - 1; j >= 1; j--) {
    // Pivot of joint j: base plus the links before it.
    let r = 0;
    let y = BASE_Y;
    let phi = 0;
    for (let i = 1; i < j; i++) {
      phi += angles[i];
      r += Math.sin(phi) * LINK;
      y += Math.cos(phi) * LINK;
    }
    const tip = planarTip(angles);
    // Angle of each direction measured from vertical, the same convention as phi.
    const a = Math.atan2(tip.r - r, tip.y - y);
    const b = Math.atan2(tr - r, ty - y);
    angles[j] = clamp(angles[j] + (b - a), -PITCH_LIMIT, PITCH_LIMIT);
  }
}

type Target = { x: number; y: number }; // normalized pointer, each in [-1, 1]

function Scene({
  mode,
  sliders,
  target,
  moved,
}: {
  mode: Mode;
  sliders: number[];
  target: MutableRefObject<Target>;
  moved: number;
}) {
  const motion = useMotionAllowed();
  const invalidate = useThree((s) => s.invalidate);
  const angles = useRef([...REST]);
  const joints = useRef<(THREE.Group | null)[]>([]);

  const colors = useMemo(
    () => ({
      groups: [
        new THREE.Color(readCssColor("--accent", "#3b5bdb")),
        new THREE.Color(readCssColor("--warn", "#e8590c")),
        new THREE.Color(readCssColor("--fg", "#16181d")),
      ],
      link: new THREE.Color(readCssColor("--muted", "#5c6370")),
      floor: new THREE.Color(readCssColor("--line", "#e4e4e0")),
    }),
    [],
  );

  const apply = () => {
    joints.current.forEach((g, i) => {
      if (!g) return;
      if (i === 0) g.rotation.y = angles.current[0];
      else g.rotation.z = -angles.current[i];
    });
  };

  // Pointer mode: map the pointer to a reach point in front of the base and solve toward it.
  const solve = (sweeps: number) => {
    const t = target.current;
    const x = t.x * 2.4;
    const z = 1.2;
    const ty = BASE_Y + 0.2 + ((t.y + 1) / 2) * 3.2;
    angles.current[0] = Math.atan2(x, z);
    const tr = Math.hypot(x, z);
    for (let k = 0; k < sweeps; k++) ccdSweep(angles.current, tr, ty);
  };

  useEffect(() => {
    if (mode === "sliders") angles.current = [...sliders];
    else solve(motion ? 1 : 24); // with motion, useFrame keeps easing toward the target
    apply();
    invalidate(); // demand frameloop (reduced motion) needs a nudge to draw the new pose
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, sliders, moved, motion]);

  useFrame(() => {
    if (mode !== "pointer" || !motion) return;
    solve(2);
    apply();
  });

  const link = () => (
    <mesh position={[0, LINK / 2, 0]}>
      <cylinderGeometry args={[0.07, 0.07, LINK, 12]} />
      <meshStandardMaterial color={colors.link} />
    </mesh>
  );

  // Nested groups: each joint sits at the end of the previous link, so rotation composes like real FK.
  const chain = (i: number): React.ReactNode => (
    <group
      key={i}
      ref={(g) => void (joints.current[i] = g)}
      position={i <= 1 ? [0, i === 0 ? BASE_Y : 0, 0] : [0, LINK, 0]}
    >
      <mesh>
        <sphereGeometry args={[0.13, 16, 12]} />
        <meshStandardMaterial color={colors.groups[GROUP_OF[i]]} />
      </mesh>
      {i >= 1 && link()}
      {i === 0 ? chain(1) : i < JOINTS - 1 ? chain(i + 1) : (
        <mesh position={[0, LINK, 0]}>
          <sphereGeometry args={[0.1, 16, 12]} />
          <meshStandardMaterial color={colors.groups[2]} />
        </mesh>
      )}
    </group>
  );

  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[2, 5, 3]} intensity={1.1} />
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[1.1, 1.2, 0.1, 40]} />
        <meshStandardMaterial color={colors.floor} />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.28, 0.34, 0.3, 24]} />
        <meshStandardMaterial color={colors.link} />
      </mesh>
      {chain(0)}
    </>
  );
}

const SLIDER_LABELS = ["J1 base yaw", "J2", "J3", "J4", "J5", "J6", "J7"];
const SWATCH = ["bg-accent", "bg-warn", "bg-fg"];

export default function TetherArmDemo({ active }: { active: boolean }) {
  const [mode, setMode] = useState<Mode>("pointer");
  const [sliders, setSliders] = useState<number[]>(REST);
  const [moved, setMoved] = useState(0);
  const target = useRef<Target>({ x: 0.3, y: 0.2 });

  const onPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    if (mode !== "pointer") return;
    const b = e.currentTarget.getBoundingClientRect();
    target.current = {
      x: clamp(((e.clientX - b.left) / b.width) * 2 - 1, -1, 1),
      y: clamp(1 - ((e.clientY - b.top) / b.height) * 2, -1, 1),
    };
    setMoved((n) => n + 1);
  };

  const summary =
    mode === "pointer"
      ? "Move the pointer over the arm and its seven joints bend to reach it."
      : "Drag the sliders to set each of the seven joint angles.";

  return (
    <div>
      <div
        onPointerMove={onPointer}
        onPointerDown={onPointer}
        className="relative aspect-[4/3] w-full max-w-xl touch-pan-y overflow-hidden rounded-xl border border-line bg-bg"
      >
        {active ? (
          <CanvasShell
            label={`Made-up 3D model of a seven-joint robot arm standing in for Tether. Joints are colored by motor group: shoulder, elbow and wrist. ${summary}`}
            className="h-full w-full"
            camera={{ position: [0, 2.2, 6.2], fov: 40 }}
          >
            <Scene mode={mode} sliders={sliders} target={target} moved={moved} />
          </CanvasShell>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
        <div role="group" aria-label="Control" className="inline-flex overflow-hidden rounded-full border border-line">
          {(["pointer", "sliders"] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => setMode(m)}
              className={`px-3 py-1 font-medium ${mode === m ? "bg-accent text-bg" : "text-muted"}`}
            >
              {m === "pointer" ? "Follow pointer" : "Joint sliders"}
            </button>
          ))}
        </div>
        <ul className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          {GROUPS.map((g, i) => (
            <li key={g.name} className="inline-flex items-center gap-1.5">
              <span className={`h-2.5 w-2.5 rounded-full ${SWATCH[i]}`} aria-hidden />
              {g.name} ({g.joints})
            </li>
          ))}
        </ul>
      </div>

      {mode === "sliders" && (
        <div className="mt-3 grid max-w-xl grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
          {SLIDER_LABELS.map((label, i) => {
            const lim = i === 0 ? Math.PI / 2 : PITCH_LIMIT;
            return (
              <label key={label} className="flex items-center gap-2 text-xs text-muted">
                <span className="w-20 shrink-0">{label}</span>
                <input
                  type="range"
                  min={-lim}
                  max={lim}
                  step={0.02}
                  value={sliders[i]}
                  onChange={(e) => setSliders((s) => s.map((v, k) => (k === i ? Number(e.target.value) : v)))}
                  aria-label={`${label} angle`}
                  className="min-w-0 flex-1 accent-accent"
                />
              </label>
            );
          })}
        </div>
      )}

      <p aria-live="polite" className="mt-2 text-sm text-muted">
        {summary}
      </p>
      <p className="mt-1 text-xs text-muted">
        Made-up arm standing in for the real model. Project:{" "}
        <a href="https://uscterralabs.com" target="_blank" rel="noreferrer" className="text-accent">
          uscterralabs.com
        </a>
        .
      </p>
    </div>
  );
}
