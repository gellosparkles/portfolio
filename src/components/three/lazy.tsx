"use client";

import dynamic from "next/dynamic";

// three.js only runs in the browser; keep it out of the server render and the initial bundle.
const placeholder = () => <div className="h-full w-full animate-pulse rounded-2xl bg-accent-soft/40" />;

export const NeuralHero = dynamic(() => import("./NeuralHero"), { ssr: false, loading: placeholder });
export const ConfusionMatrix3D = dynamic(() => import("./ConfusionMatrix3D"), { ssr: false, loading: placeholder });
export const SudokuBoard3D = dynamic(() => import("./SudokuBoard3D"), { ssr: false, loading: placeholder });
