"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { DemoId } from "@/content/site";

// Demos load only in the browser, and only once their card scrolls into view.
const placeholder = () => <div className="h-56 w-full animate-pulse rounded-xl bg-accent-soft/40" />;

export const demos: Record<DemoId, ComponentType<{ active: boolean }>> = {
  "hub-route": dynamic(() => import("./HubRouteDemo"), { ssr: false, loading: placeholder }),
  "audit-pipeline": dynamic(() => import("./AuditPipelineDemo"), { ssr: false, loading: placeholder }),
  "connection-path": dynamic(() => import("./ConnectionPathDemo"), { ssr: false, loading: placeholder }),
};
