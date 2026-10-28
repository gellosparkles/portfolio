"use client";

import type { DemoId } from "@/content/site";
import { demos } from "./demos/lazy";
import { useInView } from "./demos/hooks";

/** The full interactive demo on a detail page; it plays only while on screen. */
export default function WorkDemo({ id }: { id: DemoId }) {
  const { ref, inView, seen } = useInView<HTMLDivElement>();
  const Demo = demos[id];
  return (
    <div ref={ref} className="min-h-64">
      {seen && <Demo active={inView} />}
    </div>
  );
}
