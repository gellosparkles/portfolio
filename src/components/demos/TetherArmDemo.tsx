"use client";

import { useFrame, useThree } from "@react-three/fiber";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import * as THREE from "three";
import CanvasShell, {
  readCssColor,
  useMotionAllowed,
} from "../three/CanvasShell";

type Mode = "pointer" | "sliders";

// Tether's chain alternates roll (Z) and pitch (Y) joints: Z-Y-Z-Y-Z-Y-Z. Even indices are the
// four small roll motors, coaxial with the link; odd indices are the three big pitch motors.
const JOINTS = 7;
const PITCH = [1, 3, 5];
const isRoll = (i: number) => i % 2 === 0;
const LIMIT = [Math.PI, Math.PI / 2, Math.PI, 1.92, Math.PI, 1.92, Math.PI]; // rad
const REST: number[] = [0, 0.5, 0, 0.6, 0, 0.5, 0];

const BASE_Y = 0.25; // dock height
const R2P = 0.5; // roll pivot to the next pitch axis
const P2R = 0.22; // pitch axis to the next roll pivot
const WRIST = 0.36; // last roll pivot to the claw tip
const OFFSET = 0.06; // each pitch motor's output sits slightly to one side
const SEG = [P2R + R2P, P2R + R2P, P2R + WRIST]; // planar link after each pitch joint
const H0 = BASE_Y + R2P; // height of the first pitch axis

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

/**
 * Point after the first n planar links (r outward, y up). With the middle rolls at zero every
 * pitch axis is parallel, so the arm bends in one vertical plane.
 */
function planarPoint(angles: number[], n: number) {
  let r = 0;
  let y = H0;
  let phi = 0;
  for (let k = 0; k < n; k++) {
    phi += angles[PITCH[k]];
    r += Math.sin(phi) * SEG[k];
    y += Math.cos(phi) * SEG[k];
  }
  return { r, y };
}

/** One cyclic-coordinate-descent sweep over the pitch joints, tip-ward first, toward (tr, ty). */
function ccdSweep(angles: number[], tr: number, ty: number) {
  for (let k = PITCH.length - 1; k >= 0; k--) {
    const pivot = planarPoint(angles, k);
    const tip = planarPoint(angles, PITCH.length);
    // Angle of each direction measured from vertical, the same convention as phi.
    const a = Math.atan2(tip.r - pivot.r, tip.y - pivot.y);
    const b = Math.atan2(tr - pivot.r, ty - pivot.y);
    const j = PITCH[k];
    angles[j] = clamp(angles[j] + (b - a), -LIMIT[j], LIMIT[j]);
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
      big: new THREE.Color(readCssColor("--accent", "#2f6b4f")),
      small: new THREE.Color(readCssColor("--warn", "#d9583a")),
      hub: new THREE.Color(readCssColor("--fg", "#151513")),
      link: new THREE.Color(readCssColor("--muted", "#6a6961")),
      floor: new THREE.Color(readCssColor("--line", "#d3d1c8")),
    }),
    [],
  );

  const apply = () => {
    joints.current.forEach((g, i) => {
      if (!g) return;
      if (isRoll(i)) g.rotation.y = angles.current[i];
      else g.rotation.z = -angles.current[i];
    });
  };

  // Pointer mode: J1 rolls the arm's plane toward the pointer, the big pitch motors reach for it.
  const solve = (sweeps: number) => {
    const t = target.current;
    const x = t.x * 1.8;
    const z = 1.0;
    const a = angles.current;
    a[0] = Math.atan2(-z, x);
    a[2] = a[4] = a[6] = 0;
    const tr = Math.hypot(x, z);
    const ty = 0.3 + ((t.y + 1) / 2) * 2.4;
    for (let k = 0; k < sweeps; k++) ccdSweep(a, tr, ty);
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

  const tube = (length: number, z = 0) => (
    <mesh position={[0, length / 2, z]}>
      <cylinderGeometry args={[0.045, 0.045, length, 12]} />
      <meshStandardMaterial color={colors.link} />
    </mesh>
  );

  const claw = (
    <>
      <mesh position={[0, 0.22, 0]}>
        <boxGeometry args={[0.24, 0.05, 0.1]} />
        <meshStandardMaterial color={colors.link} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.09, 0.3, 0]}>
          <boxGeometry args={[0.04, 0.13, 0.08]} />
          <meshStandardMaterial color={colors.hub} />
        </mesh>
      ))}
    </>
  );

  // Nested groups: each joint sits on the previous one's output, so rotation composes like real FK.
  const joint = (i: number): React.ReactNode => {
    const ref = (g: THREE.Group | null) => void (joints.current[i] = g);
    if (isRoll(i)) {
      const side = i === 0 ? 0 : i % 4 === 2 ? OFFSET : -OFFSET;
      return (
        <group
          key={i}
          ref={ref}
          position={i === 0 ? [0, BASE_Y, 0] : [0, P2R, side]}
        >
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.16, 20]} />
            <meshStandardMaterial color={colors.small} />
          </mesh>
          {i < JOINTS - 1 ? (
            <>
              {tube(R2P)}
              {joint(i + 1)}
            </>
          ) : (
            claw
          )}
        </group>
      );
    }
    return (
      <group key={i} ref={ref} position={[0, R2P, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.2, 28]} />
          <meshStandardMaterial color={colors.big} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.22, 16]} />
          <meshStandardMaterial color={colors.hub} />
        </mesh>
        {tube(P2R, i % 4 === 1 ? OFFSET : -OFFSET)}
        {joint(i + 1)}
      </group>
    );
  };

  return (
    // The camera looks at the origin, so drop the arm until its middle sits there.
    <group position={[0, -1.3, 0]}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[2, 5, 3]} intensity={1.1} />
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[1.1, 1.2, 0.1, 40]} />
        <meshStandardMaterial color={colors.floor} />
      </mesh>
      {/* Circular dock the arm anchors in. */}
      <mesh position={[0, BASE_Y / 2, 0]}>
        <cylinderGeometry args={[0.32, 0.36, BASE_Y, 32]} />
        <meshStandardMaterial color={colors.link} />
      </mesh>
      <mesh position={[0, BASE_Y, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.28, 0.035, 10, 40]} />
        <meshStandardMaterial color={colors.hub} />
      </mesh>
      {joint(0)}
    </group>
  );
}

const SLIDER_LABELS = Array.from(
  { length: JOINTS },
  (_, i) => `J${i + 1} ${isRoll(i) ? "roll" : "pitch"}`,
);
const LEGEND = [
  { name: "Big motors", joints: "3 pitch", swatch: "bg-accent" },
  { name: "Small motors", joints: "4 roll", swatch: "bg-warn" },
];

export default function TetherArmDemo({
  active,
  preview,
}: {
  active: boolean;
  preview?: boolean;
}) {
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
      ? "Move the pointer: the first roll motor turns the arm toward it and the three pitch motors bend to reach it."
      : "Drag the sliders to set each joint. Roll joints spin the chain about its length, pitch joints bend it.";

  return (
    <div>
      <div
        onPointerMove={onPointer}
        onPointerDown={onPointer}
        className="relative aspect-[4/3] w-full max-w-xl touch-pan-y overflow-hidden rounded-xl border border-line bg-bg"
      >
        {active ? (
          <CanvasShell
            label={`3D model of Tether's seven-joint chain: four small roll motors alternate with three big pitch motors, from the dock to the claw. ${summary}`}
            className="h-full w-full"
            camera={{ position: [0, 0.8, 5], fov: 40 }}
          >
            <Scene
              mode={mode}
              sliders={sliders}
              target={target}
              moved={moved}
            />
          </CanvasShell>
        ) : null}
      </div>

      {!preview && (
        <>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <div
              role="group"
              aria-label="Control"
              className="inline-flex overflow-hidden rounded-full border border-line"
            >
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
              {LEGEND.map((g) => (
                <li key={g.name} className="inline-flex items-center gap-1.5">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${g.swatch}`}
                    aria-hidden
                  />
                  {g.name} ({g.joints})
                </li>
              ))}
            </ul>
          </div>

          {mode === "sliders" && (
            <div className="mt-3 grid max-w-xl grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
              {SLIDER_LABELS.map((label, i) => (
                <label
                  key={label}
                  className="flex items-center gap-2 text-xs text-muted"
                >
                  <span className="w-16 shrink-0">{label}</span>
                  <input
                    type="range"
                    min={-LIMIT[i]}
                    max={LIMIT[i]}
                    step={0.02}
                    value={sliders[i]}
                    onChange={(e) =>
                      setSliders((s) =>
                        s.map((v, k) => (k === i ? Number(e.target.value) : v)),
                      )
                    }
                    aria-label={`${label} angle`}
                    className="min-w-0 flex-1 accent-accent"
                  />
                </label>
              ))}
            </div>
          )}

          <p aria-live="polite" className="mt-2 text-sm text-muted">
            {summary}
          </p>
          <p className="mt-1 text-xs text-muted">
            Joint layout matches the real arm (Z-Y-Z-Y-Z-Y-Z); proportions are
            approximate. Project:{" "}
            <a
              href="https://uscterralabs.com"
              target="_blank"
              rel="noreferrer"
              className="text-accent"
            >
              uscterralabs.com
            </a>
            .
          </p>
        </>
      )}
    </div>
  );
}
