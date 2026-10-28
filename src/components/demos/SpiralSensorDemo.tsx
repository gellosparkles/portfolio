"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import CanvasShell, {
  readCssColor,
  useMotionAllowed,
} from "../three/CanvasShell";

type Mode = "published" | "redesign";

const HALVES = 6; // half-turns in the redesign spiral (3 full turns)
const ARCHES = 7; // half-circle arches in the published layout
const R0 = 0.24; // radius where the channel leaves the inlet
const PITCH = 0.24; // radius gained per half-turn
const WIDTH = 0.15; // channel width
const STEP = 0.03; // sample spacing along the channel
const FILL_SECONDS = 6;
const LEAK_TRAVEL = 0.9; // how far the fluid front moves past a corner while its leak grows
const DROPS_PER_CORNER = 3;

const FLOOR_Y = 0.021;
const FILL_Y = 0.05;
const WALL_TOP = 0.09;

type Corner = { at: number; p: THREE.Vector2; out: THREE.Vector2 };
type Channel = { pts: THREE.Vector2[]; cum: number[]; corners: Corner[] };

function pushArc(
  pts: THREE.Vector2[],
  r0: number,
  r1: number,
  a0: number,
  a1: number,
) {
  const n = Math.max(
    2,
    Math.ceil((Math.abs(a1 - a0) * Math.max(r0, r1)) / STEP),
  );
  for (let i = 1; i <= n; i++) {
    const t = i / n;
    const a = a0 + (a1 - a0) * t;
    const r = r0 + (r1 - r0) * t;
    pts.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r));
  }
}

/** A half-circle U-turn around `c`, from angle a0 to a1 (radians, ±π apart). */
function pushHairpin(
  pts: THREE.Vector2[],
  c: THREE.Vector2,
  r: number,
  a0: number,
  a1: number,
) {
  const n = Math.max(2, Math.ceil((Math.abs(a1 - a0) * r) / STEP));
  for (let i = 1; i <= n; i++) {
    const a = a0 + ((a1 - a0) * i) / n;
    pts.push(new THREE.Vector2(c.x + Math.cos(a) * r, c.y + Math.sin(a) * r));
  }
}

/**
 * Generic layouts, not the real lab geometry.
 * Published: nested half-circle arches on one half of the patch, each joined to the next by a tight
 * hairpin U-turn, so the fluid reverses direction at every turn (after the IEEE paper's figure).
 * Redesign: one continuous full-circle (Archimedean) spiral with no sharp turns.
 */
function buildChannel(mode: Mode): Channel {
  const marks: { i: number; out: THREE.Vector2 }[] = [];
  let pts: THREE.Vector2[];
  if (mode === "published") {
    pts = [new THREE.Vector2(-R0, 0)];
    for (let k = 0; k < ARCHES; k++) {
      const r = R0 + k * PITCH;
      // Even arches run left to right over the top, odd ones back again.
      const [a0, a1] = k % 2 === 0 ? [Math.PI, 0] : [0, Math.PI];
      pushArc(pts, r, r, a0, a1);
      if (k === ARCHES - 1) break;
      // Hairpin below the diameter, from radius r to r + PITCH on the same side.
      const side = k % 2 === 0 ? 1 : -1;
      const c = new THREE.Vector2(side * (r + PITCH / 2), 0);
      const h0 = side > 0 ? Math.PI : 0;
      pushHairpin(pts, c, PITCH / 2, h0, h0 + side * Math.PI);
      const apex =
        pts.length -
        1 -
        Math.round(Math.ceil((Math.PI * PITCH) / 2 / STEP) / 2);
      marks.push({ i: apex, out: pts[apex].clone().sub(c).normalize() });
    }
  } else {
    pts = [new THREE.Vector2(R0, 0)];
    pushArc(pts, R0, R0 + HALVES * PITCH, 0, HALVES * Math.PI);
  }

  const cum = [0];
  for (let i = 1; i < pts.length; i++)
    cum.push(cum[i - 1] + pts[i].distanceTo(pts[i - 1]));
  const corners = marks.map(({ i, out }) => ({ at: cum[i], p: pts[i], out }));
  return { pts, cum, corners };
}

/** Left and right channel edges, mitered so the sharp corners stay sharp. */
function edges(pts: THREE.Vector2[], width: number) {
  const left: THREE.Vector2[] = [];
  const right: THREE.Vector2[] = [];
  const n = pts.length;
  for (let i = 0; i < n; i++) {
    const t1 = (
      i > 0 ? pts[i].clone().sub(pts[i - 1]) : pts[1].clone().sub(pts[0])
    ).normalize();
    const t2 = (
      i < n - 1 ? pts[i + 1].clone().sub(pts[i]) : t1.clone()
    ).normalize();
    const n1 = new THREE.Vector2(-t1.y, t1.x);
    const m = n1.clone().add(new THREE.Vector2(-t2.y, t2.x)).normalize();
    const s = width / 2 / Math.max(0.3, m.dot(n1));
    left.push(pts[i].clone().addScaledVector(m, s));
    right.push(pts[i].clone().addScaledVector(m, -s));
  }
  return { left, right };
}

/** A strip of quads between two point rows; segment i is indices [6i, 6i + 6). */
function strip(a: THREE.Vector3[], b: THREE.Vector3[]) {
  const pos = new Float32Array(a.length * 6);
  a.forEach((p, i) => {
    p.toArray(pos, i * 6);
    b[i].toArray(pos, i * 6 + 3);
  });
  const idx: number[] = [];
  for (let i = 0; i < a.length - 1; i++) {
    const [p, q, r, s] = [2 * i, 2 * i + 1, 2 * i + 2, 2 * i + 3];
    idx.push(p, q, r, q, s, r);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

const at = (v: THREE.Vector2, y: number) => new THREE.Vector3(v.x, y, v.y);

function Scene({ mode, run }: { mode: Mode; run: number }) {
  const motion = useMotionAllowed();
  const invalidate = useThree((s) => s.invalidate);
  const elapsed = useRef(0);
  const drops = useRef<(THREE.Mesh | null)[]>([]);

  const colors = useMemo(
    () => ({
      patch: new THREE.Color(readCssColor("--surface", "#ffffff")),
      floor: new THREE.Color(readCssColor("--line", "#e4e4e0")),
      wall: new THREE.Color(readCssColor("--muted", "#5c6370")),
      accent: new THREE.Color(readCssColor("--accent", "#3b5bdb")),
      warn: new THREE.Color(readCssColor("--warn", "#e8590c")),
    }),
    [],
  );

  const { channel, floor, walls, fill } = useMemo(() => {
    const ch = buildChannel(mode);
    const outer = edges(ch.pts, WIDTH);
    const inner = edges(ch.pts, WIDTH * 0.8);
    return {
      channel: ch,
      floor: strip(
        outer.left.map((v) => at(v, FLOOR_Y)),
        outer.right.map((v) => at(v, FLOOR_Y)),
      ),
      walls: [outer.left, outer.right].map((e) =>
        strip(
          e.map((v) => at(v, FLOOR_Y)),
          e.map((v) => at(v, WALL_TOP)),
        ),
      ),
      fill: strip(
        inner.left.map((v) => at(v, FILL_Y)),
        inner.right.map((v) => at(v, FILL_Y)),
      ),
    };
  }, [mode]);
  useEffect(
    () => () => {
      [floor, fill, ...walls].forEach((g) => g.dispose());
    },
    [floor, fill, walls],
  );

  const total = channel.cum[channel.cum.length - 1];

  const apply = (t: number) => {
    const front = Math.min(1, t / FILL_SECONDS) * total;
    let seg = 0;
    while (seg < channel.cum.length - 1 && channel.cum[seg + 1] <= front) seg++;
    fill.setDrawRange(0, seg * 6);

    // Each sharp turn starts leaking once the fluid front passes it; the puddle spreads on the outside of the bend.
    channel.corners.forEach((c, ci) => {
      const grown = THREE.MathUtils.clamp((front - c.at) / LEAK_TRAVEL, 0, 1);
      for (let d = 0; d < DROPS_PER_CORNER; d++) {
        const m = drops.current[ci * DROPS_PER_CORNER + d];
        if (!m) continue;
        const reach = WIDTH * 0.6 + grown * (0.05 + d * 0.07);
        const size = grown * (0.075 - d * 0.018);
        m.position.set(
          c.p.x + c.out.x * reach,
          FLOOR_Y + 0.005,
          c.p.y + c.out.y * reach,
        );
        m.scale.set(size, size * 0.35, size);
        m.visible = grown > 0;
      }
    });
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

  const start = channel.pts[0];
  const end = channel.pts[channel.pts.length - 1];

  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight position={[2, 5, 3]} intensity={1.2} />
      <group rotation={[0, Math.PI, 0]}>
        {/* sensor patch */}
        <mesh position={[0, -0.02, 0]}>
          <cylinderGeometry args={[2.05, 2.05, 0.08, 72]} />
          <meshStandardMaterial color={colors.patch} />
        </mesh>
        <mesh geometry={floor}>
          <meshStandardMaterial color={colors.floor} side={THREE.DoubleSide} />
        </mesh>
        {walls.map((g, i) => (
          <mesh key={i} geometry={g}>
            <meshStandardMaterial color={colors.wall} side={THREE.DoubleSide} />
          </mesh>
        ))}
        {/* liquid */}
        <mesh geometry={fill}>
          <meshStandardMaterial color={colors.accent} side={THREE.DoubleSide} />
        </mesh>
        {/* inlet and outlet */}
        <mesh position={[start.x, 0.05, start.y]}>
          <cylinderGeometry args={[0.13, 0.13, 0.06, 24]} />
          <meshStandardMaterial color={colors.accent} />
        </mesh>
        <mesh position={[end.x, 0.05, end.y]}>
          <cylinderGeometry args={[0.1, 0.1, 0.06, 24]} />
          <meshStandardMaterial color={colors.wall} />
        </mesh>
        {Array.from(
          { length: channel.corners.length * DROPS_PER_CORNER },
          (_, i) => (
            <mesh
              key={`${mode}-${i}`}
              ref={(m) => void (drops.current[i] = m)}
              visible={false}
            >
              <sphereGeometry args={[1, 16, 10]} />
              <meshStandardMaterial color={colors.warn} />
            </mesh>
          ),
        )}
      </group>
    </>
  );
}

const DESCRIPTION: Record<Mode, string> = {
  published:
    "Published: half-circle arches joined by hairpin turns. Fluid leaks at every turn.",
  redesign:
    "My redesign: one smooth full-circle spiral. No sharp turns, no leaks.",
};

export default function SpiralSensorDemo({
  active,
  preview,
}: {
  active: boolean;
  preview?: boolean;
}) {
  const [mode, setMode] = useState<Mode>("published");
  const [run, setRun] = useState(0);

  return (
    <div className="mx-auto max-w-xl">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-line bg-bg">
        {active ? (
          <CanvasShell
            label={`Stylized 3D sensor patch with a spiral microfluidic channel. ${DESCRIPTION[mode]}`}
            className="h-full w-full"
            camera={{ position: [0, 5.4, 2.4], fov: 40 }}
          >
            <Scene mode={mode} run={run} />
          </CanvasShell>
        ) : null}
      </div>

      {!preview && (
        <>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <div
              role="group"
              aria-label="Design"
              className="inline-flex overflow-hidden rounded-full border border-line"
            >
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
            <button
              type="button"
              onClick={() => setRun((r) => r + 1)}
              className="rounded-full border border-line px-3 py-1 text-muted"
            >
              Replay
            </button>
          </div>

          <p aria-live="polite" className="mt-2 text-sm text-muted">
            {DESCRIPTION[mode]}
          </p>
          <p className="mt-1 text-xs text-muted">
            Generic illustration; both spirals are stylized and not the real lab
            layout. Original design:{" "}
            <a
              href="https://ieeexplore.ieee.org/document/11033194"
              target="_blank"
              rel="noreferrer"
              className="text-accent"
            >
              IEEE paper
            </a>
            .
          </p>
        </>
      )}
    </div>
  );
}
