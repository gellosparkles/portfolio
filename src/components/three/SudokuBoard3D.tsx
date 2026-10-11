"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import CanvasShell, { readCssColor, useMotionAllowed } from "./CanvasShell";

/** One white-on-transparent texture per digit; materials tint them. */
function useDigitTextures() {
  const textures = useMemo(
    () =>
      Array.from({ length: 10 }, (_, d) => {
        const c = document.createElement("canvas");
        c.width = c.height = 128;
        const ctx = c.getContext("2d")!;
        if (d > 0) {
          ctx.fillStyle = "#fff";
          ctx.font = "600 84px ui-sans-serif, system-ui, sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(String(d), 64, 70);
        }
        const t = new THREE.CanvasTexture(c);
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = 4;
        return t;
      }),
    [],
  );
  useEffect(() => () => textures.forEach((t) => t.dispose()), [textures]);
  return textures;
}

export type CellState = { value: number; given: boolean; flash: "place" | "undo" | null };

function cellPos(i: number): [number, number] {
  const r = Math.floor(i / 9);
  const c = i % 9;
  // extra gap between 3×3 boxes
  const x = (c - 4) * 0.62 + (Math.floor(c / 3) - 1) * 0.12;
  const z = (r - 4) * 0.62 + (Math.floor(r / 3) - 1) * 0.12;
  return [x, z];
}

function Tile({ index, cell, textures }: { index: number; cell: CellState; textures: THREE.Texture[] }) {
  const motion = useMotionAllowed();
  const tile = useRef<THREE.Mesh>(null);
  const tileMat = useRef<THREE.MeshStandardMaterial>(null);
  const digitMat = useRef<THREE.MeshBasicMaterial>(null);
  const lift = useRef(0);
  const colors = useMemo(
    () => ({
      surface: new THREE.Color(readCssColor("--surface", "#ffffff")),
      line: new THREE.Color(readCssColor("--line", "#e4e4e0")),
      fg: new THREE.Color(readCssColor("--fg", "#16181d")),
      accent: new THREE.Color(readCssColor("--accent", "#3b5bdb")),
      warn: new THREE.Color(readCssColor("--warn", "#e8590c")),
    }),
    [],
  );
  const [x, z] = cellPos(index);

  useEffect(() => {
    if (cell.flash) lift.current = 1;
  }, [cell]);

  useFrame((_, dt) => {
    lift.current = motion ? Math.max(0, lift.current - dt * 3) : 0;
    if (tile.current) tile.current.position.y = lift.current * 0.18;
    if (tileMat.current) {
      const base = cell.given ? colors.line : colors.surface;
      const hl = cell.flash === "undo" ? colors.warn : colors.accent;
      tileMat.current.color.copy(base).lerp(hl, lift.current * 0.55);
    }
    if (digitMat.current) digitMat.current.color.copy(cell.given ? colors.fg : colors.accent);
  });

  return (
    <group position={[x, 0, z]}>
      <mesh ref={tile}>
        <boxGeometry args={[0.56, 0.14, 0.56]} />
        <meshStandardMaterial ref={tileMat} roughness={0.7} />
        <mesh position={[0, 0.0705, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.5, 0.5]} />
          <meshBasicMaterial ref={digitMat} map={textures[cell.value]} transparent toneMapped={false} />
        </mesh>
      </mesh>
    </group>
  );
}

function Board({ cells }: { cells: CellState[] }) {
  const textures = useDigitTextures();
  const group = useRef<THREE.Group>(null);
  const base = useMemo(() => new THREE.Color(readCssColor("--muted", "#5c6370")), []);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    g.rotation.x += (-0.15 + state.pointer.y * 0.15 - g.rotation.x) * 0.06;
    g.rotation.z += (-state.pointer.x * 0.12 - g.rotation.z) * 0.06;
  });

  return (
    <group ref={group}>
      <mesh position={[0, -0.12, 0]}>
        <boxGeometry args={[6.1, 0.1, 6.1]} />
        <meshStandardMaterial color={base} roughness={0.9} />
      </mesh>
      {cells.map((cell, i) => (
        <Tile key={i} index={i} cell={cell} textures={textures} />
      ))}
    </group>
  );
}

export default function SudokuBoard3D({ cells, className }: { cells: CellState[]; className?: string }) {
  return (
    <CanvasShell
      className={className}
      label="3D Sudoku board. Given digits are dark; digits placed by the solver are in the accent color, and backtracked cells flash orange."
      camera={{ position: [0, 7.8, 4.9], fov: 42 }}
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[3, 8, 4]} intensity={1.4} />
      <Board cells={cells} />
    </CanvasShell>
  );
}
