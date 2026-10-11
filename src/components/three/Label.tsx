"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { readCssColor } from "./CanvasShell";

/**
 * Text drawn to a canvas and shown as a camera-facing sprite. Used instead of drei <Html>,
 * which mounts a separate React root per label and drops labels under StrictMode.
 */
export default function Label({
  text,
  position,
  height = 0.2,
  color = "--muted",
  weight = 400,
  mono = true,
  align = "center",
}: {
  text: string;
  position: [number, number, number];
  height?: number;
  color?: string;
  weight?: number;
  mono?: boolean;
  align?: "left" | "center" | "right";
}) {
  const { texture, aspect } = useMemo(() => {
    const px = 64;
    const font = `${weight} ${px}px ${mono ? "ui-monospace, SFMono-Regular, Menlo, monospace" : "ui-sans-serif, system-ui, sans-serif"}`;
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d")!;
    ctx.font = font;
    const w = Math.ceil(ctx.measureText(text).width) + 8;
    c.width = w;
    c.height = Math.ceil(px * 1.3);
    ctx.font = font;
    ctx.fillStyle = readCssColor(color, "#888");
    ctx.textBaseline = "middle";
    ctx.fillText(text, 4, c.height / 2);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return { texture: t, aspect: w / c.height };
  }, [text, color, weight, mono]);
  useEffect(() => () => texture.dispose(), [texture]);

  const width = height * aspect;
  const offset = align === "left" ? width / 2 : align === "right" ? -width / 2 : 0;

  return (
    <sprite position={[position[0] + offset, position[1], position[2]]} scale={[width, height, 1]}>
      <spriteMaterial map={texture} transparent depthWrite={false} toneMapped={false} />
    </sprite>
  );
}
