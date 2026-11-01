"use client";

import { useSyncExternalStore } from "react";
import { THEME_KEY } from "./themeScript";

export type Theme = "light" | "dark";

function subscribe(onChange: () => void) {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}

const read = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

/** The active theme, following the data-theme attribute on <html>. Light is the default. */
export function useTheme() {
  return useSyncExternalStore(subscribe, read, () => "light" as Theme);
}

export function setTheme(t: Theme) {
  const root = document.documentElement;
  if (t === "dark") root.dataset.theme = "dark";
  else delete root.dataset.theme;
  try {
    localStorage.setItem(THEME_KEY, t);
  } catch {}
}
