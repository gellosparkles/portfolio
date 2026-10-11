"use client";

import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import CanvasShell, { readCssColor, useMotionAllowed } from "./CanvasShell";
import Label from "./Label";
import { gestureClasses } from "@/content/gesture";

const N = 5;
const GAP = 1.15;
const MAX = 6;
const short = ["L-swipe", "R-swipe", "Pause", "Thumb ↓", "Thumb ↑"];

export type Cell = { row: number; col: number; count: number };

function Bar({
  row,
  col,
  count,
  hovered,
  onHover,
}: Cell & { hovered: boolean; onHover: (c: Cell | null) => void }) {
  const motion = useMotionAllowed();
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const colors = useMemo(
    () => ({
      accent: new THREE.Color(readCssColor("--accent", "#3b5bdb")),
      warn: new THREE.Color(readCssColor("--warn", "#e8590c")),
      base: new THREE.Color(readCssColor("--line", "#e4e4e0")),
    }),
    [],
  );
  const x = (col - (N - 1) / 2) * GAP;
  const z = (row - (N - 1) / 2) * GAP;
  const target = 0.04 + (count / MAX) * 2.1;

  useFrame(() => {
    const m = mesh.current;
    if (!m) return;
    const h = motion ? THREE.MathUtils.lerp(m.scale.y, target, 0.12) : target;
    m.scale.y = h;
    m.position.y = h / 2;
    if (mat.current) {
      const hue = row === col ? colors.accent : colors.warn;
      mat.current.color.copy(colors.base).lerp(hue, count === 0 ? 0 : 0.35 + (count / MAX) * 0.65);
      mat.current.emissive.copy(hue).multiplyScalar(hovered ? 0.35 : 0);
    }
  });

  return (
    <mesh
      ref={mesh}
      position={[x, target / 2, z]}
      scale={[1, target, 1]}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover({ row, col, count });
      }}
      onPointerOut={() => onHover(null)}
    >
      <boxGeometry args={[0.9, 1, 0.9]} />
      <meshStandardMaterial ref={mat} roughness={0.55} metalness={0.05} />
    </mesh>
  );
}

function Scene({
  matrix,
  hovered,
  onHover,
}: {
  matrix: number[][];
  hovered: Cell | null;
  onHover: (c: Cell | null) => void;
}) {
  const edge = (N / 2) * GAP + 0.15;
  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 8, 5]} intensity={1.6} />
      <directionalLight position={[-5, 4, -3]} intensity={0.4} />
      <group>
        {matrix.map((r, ri) =>
          r.map((count, ci) => (
            <Bar
              key={`${ri}-${ci}`}
              row={ri}
              col={ci}
              count={count}
              hovered={hovered?.row === ri && hovered?.col === ci}
              onHover={onHover}
            />
          )),
        )}
        {short.map((s, i) => (
          <group key={s}>
            <Label text={s} position={[(i - (N - 1) / 2) * GAP, 0.05, edge + 0.25]} height={0.3} />
            <Label text={s} position={[-edge - 0.15, 0.05, (i - (N - 1) / 2) * GAP]} height={0.3} align="right" />
          </group>
        ))}
        <Label text="Predicted →" position={[0, 0.05, edge + 0.85]} height={0.32} color="--fg" weight={600} mono={false} />
        <Label text="True ↓" position={[-edge - 1.9, 0.05, 0]} height={0.32} color="--fg" weight={600} mono={false} align="right" />
      </group>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={0.25}
        maxPolarAngle={1.25}
        target={[0, 0.3, 0.5]}
      />
    </>
  );
}

export default function ConfusionMatrix3D({
  matrix,
  hovered,
  onHover,
  className,
}: {
  matrix: number[][];
  hovered: Cell | null;
  onHover: (c: Cell | null) => void;
  className?: string;
}) {
  return (
    <CanvasShell
      className={className}
      label={`3D confusion matrix. Rows are true gestures (${gestureClasses.join(", ")}); columns are predictions. Bar height is the number of test clips. Drag to rotate.`}
      camera={{ position: [2.4, 10.2, 7.6], fov: 38 }}
    >
      <Scene matrix={matrix} hovered={hovered} onHover={onHover} />
    </CanvasShell>
  );
}
