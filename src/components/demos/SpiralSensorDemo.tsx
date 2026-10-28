"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import CanvasShell, { readCssColor, useMotionAllowed } from "../three/CanvasShell";

type Mode = "published" | "redesign";

const TURNS = 3;
const TUBULAR = 240;
const RADIAL = 8;
const FILL_SECONDS = 5;
const LEAK_AT = 0.5; // fraction of the channel where the original design starts to leak
const STALL_AT = 0.62; // the leaking design never fills past this
const DROPLETS = 7;

/** A generic Archimedean spiral, center outward. Not any real lab geometry. */
function spiralCurve() {
  const pts = Array.from({ length: 160 }, (_, i) => {
    const t = i / 159;
    const a = t * TURNS * Math.PI * 2;
    const r = 0.16 + t * 1.45;
    return new THREE.Vector3(Math.cos(a) * r, 0.07, Math.sin(a) * r);
  });
  return new THREE.CatmullRomCurve3(pts);
}

function Scene({ mode, run }: { mode: Mode; run: number }) {
  const motion = useMotionAllowed();
  const invalidate = useThree((s) => s.invalidate);
  const elapsed = useRef(0);
  const drops = useRef<(THREE.Mesh | null)[]>([]);

  const colors = useMemo(
    () => ({
      patch: new THREE.Color(readCssColor("--surface", "#ffffff")),
      line: new THREE.Color(readCssColor("--line", "#e4e4e0")),
      accent: new THREE.Color(readCssColor("--accent", "#3b5bdb")),
      warn: new THREE.Color(readCssColor("--warn", "#e8590c")),
    }),
    [],
  );

  const { channel, fill, leakPoint, outward } = useMemo(() => {
    const c = spiralCurve();
    const leak = c.getPointAt(LEAK_AT);
    return {
      channel: new THREE.TubeGeometry(c, TUBULAR, 0.07, RADIAL),
      fill: new THREE.TubeGeometry(c, TUBULAR, 0.055, RADIAL),
      leakPoint: leak,
      outward: new THREE.Vector3(leak.x, 0, leak.z).normalize(),
    };
  }, []);
  useEffect(
    () => () => {
      channel.dispose();
      fill.dispose();
    },
    [channel, fill],
  );

  const apply = (t: number) => {
    const end = mode === "redesign" ? 1 : STALL_AT;
    const frac = Math.min(end, (t / FILL_SECONDS) * end);
    fill.setDrawRange(0, Math.floor(frac * TUBULAR) * RADIAL * 6);
    if (mode === "published") {
      // Droplets grow once the front passes the leak point, then spread outward over the patch.
      const grown = Math.max(0, Math.min(1, (frac - LEAK_AT) / (STALL_AT - LEAK_AT)));
      drops.current.forEach((m, i) => {
        if (!m) return;
        const k = (i + 1) / DROPLETS;
        const spread = 0.12 + grown * (0.15 + k * 0.5);
        const side = (i % 2 ? 1 : -1) * k * 0.28;
        m.position.set(
          leakPoint.x + outward.x * spread - outward.z * side,
          0.04,
          leakPoint.z + outward.z * spread + outward.x * side,
        );
        m.scale.setScalar(grown * (1.1 - k * 0.6));
        m.visible = grown > 0;
      });
    }
  };

  // Restart the fill when the toggle or the replay button changes. Reduced motion jumps to the end.
  useEffect(() => {
    elapsed.current = motion ? 0 : FILL_SECONDS;
    apply(elapsed.current);
    invalidate(); // demand frameloop (reduced motion) needs a nudge to draw the end state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, run, motion]);

  useFrame((_, dt) => {
    if (elapsed.current >= FILL_SECONDS) return;
    elapsed.current = Math.min(FILL_SECONDS, elapsed.current + dt);
    apply(elapsed.current);
  });

  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[2, 5, 3]} intensity={1.1} />
      <group rotation={[0, 0.35, 0]}>
        {/* sensor patch */}
        <mesh position={[0, -0.02, 0]}>
          <boxGeometry args={[4.2, 0.08, 4.2]} />
          <meshStandardMaterial color={colors.patch} />
        </mesh>
        {/* empty channel */}
        <mesh geometry={channel}>
          <meshStandardMaterial color={colors.line} />
        </mesh>
        {/* liquid */}
        <mesh geometry={fill}>
          <meshStandardMaterial color={colors.accent} />
        </mesh>
        {/* inlet at the center */}
        <mesh position={[0, 0.09, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.06, 24]} />
          <meshStandardMaterial color={colors.accent} />
        </mesh>
        {mode === "published" &&
          Array.from({ length: DROPLETS }, (_, i) => (
            <mesh key={i} ref={(m) => void (drops.current[i] = m)} visible={false}>
              <sphereGeometry args={[0.1, 16, 12]} />
              <meshStandardMaterial color={colors.warn} />
            </mesh>
          ))}
      </group>
    </>
  );
}

const DESCRIPTION: Record<Mode, string> = {
  published: "Published design: fluid fills the spiral from the center, then droplets escape through the channel wall and the fill stalls.",
  redesign: "My redesign: the channel stays sealed and fluid fills the whole spiral from the center outward.",
};

export default function SpiralSensorDemo({ active }: { active: boolean }) {
  const [mode, setMode] = useState<Mode>("published");
  const [run, setRun] = useState(0);

  return (
    <div>
      <div className="relative aspect-[4/3] w-full max-w-xl overflow-hidden rounded-xl border border-line bg-bg">
        {active ? (
          <CanvasShell
            label={`Stylized 3D sensor patch with a spiral microfluidic channel. ${DESCRIPTION[mode]}`}
            className="h-full w-full"
            camera={{ position: [0, 4.6, 3.4], fov: 40 }}
          >
            <Scene mode={mode} run={run} />
          </CanvasShell>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
        <div role="group" aria-label="Design" className="inline-flex overflow-hidden rounded-full border border-line">
          {(["published", "redesign"] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => {
                setMode(m);
                setRun((r) => r + 1);
              }}
              className={`px-3 py-1 font-medium ${mode === m ? "bg-accent text-bg" : "text-muted"}`}
            >
              {m === "published" ? "Published design" : "My redesign"}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => setRun((r) => r + 1)} className="rounded-full border border-line px-3 py-1 text-muted">
          Replay
        </button>
      </div>

      <p aria-live="polite" className="mt-2 text-sm text-muted">
        {DESCRIPTION[mode]}
      </p>
      <p className="mt-1 text-xs text-muted">
        Generic illustration; both spirals are stylized and not the real lab layout. Original design:{" "}
        <a href="https://ieeexplore.ieee.org/document/11033194" target="_blank" rel="noreferrer" className="text-accent">
          IEEE paper
        </a>
        .
      </p>
    </div>
  );
}
