"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import CanvasShell, { readCssColor, useMotionAllowed } from "./CanvasShell";
import Label from "./Label";
import { gestureClasses } from "@/content/gesture";

// Layer sizes echo the gesture model: video frames → CNN features → GRU state → 5 classes.
const LAYERS = [
  { size: 9, label: "frames" },
  { size: 12, label: "MobileNet features" },
  { size: 8, label: "GRU" },
  { size: 5, label: "gesture" },
];
const SPACING = 2.1;
const PULSES = 36;

type Node = { pos: THREE.Vector3; layer: number; id: number };
type Pulse = { from: Node; to: Node; t: number; speed: number };

function buildNetwork() {
  const nodes: Node[] = [];
  const byLayer: Node[][] = [];
  LAYERS.forEach((layer, li) => {
    const x = (li - (LAYERS.length - 1) / 2) * SPACING;
    const row: Node[] = [];
    for (let i = 0; i < layer.size; i++) {
      let y: number, z: number;
      if (li === 0) {
        // input frames as a 3×3 grid
        y = (Math.floor(i / 3) - 1) * 0.75;
        z = ((i % 3) - 1) * 0.75;
      } else if (li === LAYERS.length - 1) {
        y = ((layer.size - 1) / 2 - i) * 0.62;
        z = 0;
      } else {
        const a = (i / layer.size) * Math.PI * 2;
        const r = 0.55 + layer.size * 0.06;
        y = Math.cos(a) * r;
        z = Math.sin(a) * r;
      }
      const n = { pos: new THREE.Vector3(x, y, z), layer: li, id: nodes.length };
      nodes.push(n);
      row.push(n);
    }
    byLayer.push(row);
  });
  const edges: [Node, Node][] = [];
  for (let li = 0; li < byLayer.length - 1; li++)
    for (const a of byLayer[li]) for (const b of byLayer[li + 1]) edges.push([a, b]);
  return { nodes, byLayer, edges };
}

const { nodes, byLayer, edges } = buildNetwork();

const edgeGeom = (() => {
  const pts: number[] = [];
  for (const [a, b] of edges) pts.push(a.pos.x, a.pos.y, a.pos.z, b.pos.x, b.pos.y, b.pos.z);
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  return g;
})();

const pick = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];

// Each pulse travels from an input node through one node per layer to an output.
function newPulse(): Pulse {
  return { from: pick(byLayer[0]), to: pick(byLayer[1]), t: Math.random(), speed: 0.5 + Math.random() * 0.6 };
}

const tmp = new THREE.Object3D();
const col = new THREE.Color();

function Network() {
  const motion = useMotionAllowed();
  const group = useRef<THREE.Group>(null);
  const nodeMesh = useRef<THREE.InstancedMesh>(null);
  const pulseMesh = useRef<THREE.InstancedMesh>(null);
  const accent = useMemo(() => new THREE.Color(readCssColor("--accent", "#3b5bdb")), []);
  const muted = useMemo(() => new THREE.Color(readCssColor("--muted", "#5c6370")), []);
  const sim = useRef<{ pulses: Pulse[]; glow: Float32Array } | null>(null);
  const hovering = useRef(false);
  const el = useThree((s) => s.gl.domElement);
  const invalidate = useThree((s) => s.invalidate);

  // Only turn while the pointer is over the canvas; leaving it eases back to the rest pose.
  useEffect(() => {
    const enter = () => void (hovering.current = true);
    const move = () => invalidate();
    const leave = () => {
      hovering.current = false;
      invalidate();
    };
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("pointermove", move);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
    };
  }, [el, invalidate]);

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05);
    if (group.current) {
      const on = hovering.current;
      const targetY = on ? state.pointer.x * 0.45 : 0;
      const targetX = on ? -state.pointer.y * 0.25 : 0;
      const r = group.current.rotation;
      r.y += (targetY - r.y) * 0.08;
      r.x += (targetX - r.x) * 0.08;
      // Demand frameloop (reduced motion) keeps drawing until the ease settles.
      if (Math.abs(targetY - r.y) + Math.abs(targetX - r.x) > 1e-3) state.invalidate();
    }

    sim.current ??= { pulses: Array.from({ length: PULSES }, newPulse), glow: new Float32Array(nodes.length) };
    const { pulses, glow } = sim.current;

    if (motion) {
      for (const p of pulses) {
        p.t += d * p.speed * 1.6;
        if (p.t >= 1) {
          glow[p.to.id] = 1;
          const next = byLayer[p.to.layer + 1];
          if (next) {
            p.from = p.to;
            p.to = next[Math.floor(Math.random() * next.length)];
          } else {
            Object.assign(p, newPulse(), { t: 0 });
          }
          p.t = 0;
        }
      }
      for (let i = 0; i < glow.length; i++) glow[i] = Math.max(0, glow[i] - d * 1.8);
    }

    if (nodeMesh.current) {
      nodes.forEach((n, i) => {
        const g = glow[i];
        tmp.position.copy(n.pos);
        tmp.scale.setScalar((n.layer === LAYERS.length - 1 ? 0.13 : 0.09) * (1 + g * 0.8));
        tmp.updateMatrix();
        nodeMesh.current!.setMatrixAt(i, tmp.matrix);
        col.copy(muted).lerp(accent, n.layer === LAYERS.length - 1 ? 0.6 + g * 0.4 : 0.35 + g * 0.65);
        nodeMesh.current!.setColorAt(i, col);
      });
      nodeMesh.current.instanceMatrix.needsUpdate = true;
      if (nodeMesh.current.instanceColor) nodeMesh.current.instanceColor.needsUpdate = true;
    }

    if (pulseMesh.current) {
      pulses.forEach((p, i) => {
        tmp.position.lerpVectors(p.from.pos, p.to.pos, p.t);
        tmp.scale.setScalar(motion ? 0.045 : 0);
        tmp.updateMatrix();
        pulseMesh.current!.setMatrixAt(i, tmp.matrix);
      });
      pulseMesh.current.instanceMatrix.needsUpdate = true;
    }
  });

  const outputs = byLayer[LAYERS.length - 1];

  return (
    <group ref={group}>
      <lineSegments geometry={edgeGeom}>
        <lineBasicMaterial color={muted} transparent opacity={0.12} />
      </lineSegments>
      <instancedMesh ref={nodeMesh} args={[undefined, undefined, nodes.length]}>
        <sphereGeometry args={[1, 20, 20]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={pulseMesh} args={[undefined, undefined, PULSES]}>
        <sphereGeometry args={[1, 10, 10]} />
        <meshBasicMaterial color={accent} toneMapped={false} />
      </instancedMesh>
      {outputs.map((n, i) => (
        <Label key={i} text={gestureClasses[i]} position={[n.pos.x + 0.26, n.pos.y, n.pos.z]} height={0.19} align="left" />
      ))}
    </group>
  );
}

/** Pull the camera back on narrow canvases so the whole network (and its labels) stays in frame. */
function FitCamera() {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    const aspect = size.width / Math.max(size.height, 1);
    const halfTan = Math.tan(THREE.MathUtils.degToRad(45 / 2));
    const dist = Math.max(10 / (2 * halfTan * aspect), 4.2 / (2 * halfTan));
    camera.position.set(0.35, 0.4, dist);
    camera.lookAt(0.35, 0, 0);
    invalidate();
  }, [camera, size, invalidate]);
  return null;
}

export default function NeuralHero({ className }: { className?: string }) {
  return (
    <CanvasShell
      className={className}
      label="Animated neural network: video frames flow through MobileNet features and a GRU into five gesture classes. It turns to follow your pointer while you hover over it."
      camera={{ position: [0, 0.4, 7.2], fov: 45 }}
    >
      <FitCamera />
      <Network />
    </CanvasShell>
  );
}
