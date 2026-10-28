"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "./hooks";

type Verdict = "M" | "P" | "N";

const VERDICT_LABEL: Record<Verdict, string> = { M: "Met", P: "Partial", N: "Not met" };
const VERDICT_STYLE: Record<Verdict, string> = {
  M: "border-accent bg-accent-soft",
  P: "border-line bg-surface",
  N: "border-dashed border-muted text-muted",
};

const STAGES = [
  { name: "Generate", note: "Draft the audit questions per clause" },
  { name: "Parse", note: "Split the documents into sections" },
  { name: "ISMS check", note: "4-step check against each clause" },
  { name: "LLM verdict", note: "Gemini + Grok vote on a verdict" },
];

const CLAUSES = [
  "Policies",
  "HR security",
  "Assets",
  "Access",
  "Crypto",
  "Physical",
  "Operations",
  "Network",
  "Suppliers",
  "Incidents",
  "Continuity",
  "Compliance",
];

// Every company and verdict is invented for this demo.
const COMPANIES: { name: string; verdicts: string }[] = [
  { name: "Acme Widgets", verdicts: "MMMPMMMMPMMM" },
  { name: "Northwind Foods", verdicts: "MPNMPMPMNPMP" },
  { name: "Globex Logistics", verdicts: "NNPNMNPNNPNN" },
];

const STEP_MS = 700;

export default function AuditPipelineDemo({ active }: { active: boolean }) {
  const [pick, setPick] = useState(0);
  const [stage, setStage] = useState(0);
  const reduced = useReducedMotion();

  // Reduced motion skips straight to the finished state.
  const shown = reduced ? STAGES.length : stage;
  const done = shown >= STAGES.length;

  useEffect(() => {
    if (!active || reduced || stage >= STAGES.length) return;
    const t = setTimeout(() => setStage((s) => s + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [active, reduced, stage]);

  const company = COMPANIES[pick];
  const verdicts = company.verdicts.split("") as Verdict[];
  const count = (v: Verdict) => verdicts.filter((x) => x === v).length;
  const summary = `${company.name}: ${count("M")} met, ${count("P")} partial, ${count("N")} not met out of ${CLAUSES.length} clauses.`;

  return (
    <div>
      <div role="group" aria-label="Sample company" className="mb-3 flex flex-wrap gap-2 text-sm">
        {COMPANIES.map((c, i) => (
          <button
            key={c.name}
            type="button"
            aria-pressed={pick === i}
            onClick={() => {
              setPick(i);
              setStage(0);
            }}
            className={
              pick === i
                ? "rounded-full bg-accent px-3 py-1 font-medium text-bg"
                : "rounded-full border border-line px-3 py-1 hover:border-accent"
            }
          >
            {c.name}
          </button>
        ))}
      </div>

      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {STAGES.map((s, i) => (
          <li
            key={s.name}
            aria-current={shown === i ? "step" : undefined}
            className={`rounded-xl border p-2.5 text-xs transition-colors ${
              i < shown ? "border-accent bg-accent-soft" : "border-line"
            } ${shown === i ? "ring-1 ring-accent" : ""}`}
          >
            <p className="font-mono text-muted">Stage {i + 1}</p>
            <p className="font-semibold">{s.name}</p>
            <p className="mt-1 text-muted">{s.note}</p>
          </li>
        ))}
      </ol>

      <ul className="mt-3 grid grid-cols-3 gap-1.5 text-xs sm:grid-cols-4 md:grid-cols-6">
        {CLAUSES.map((c, i) => {
          const v = verdicts[i];
          return (
            <li
              key={c}
              className={`flex items-center justify-between gap-1 rounded-lg border px-2 py-1 ${
                done ? VERDICT_STYLE[v] : "border-line text-muted"
              }`}
            >
              <span className="truncate">{c}</span>
              <span className="font-mono font-semibold" title={done ? VERDICT_LABEL[v] : undefined}>
                {done ? v : "·"}
              </span>
            </li>
          );
        })}
      </ul>

      <p className="mt-3 text-sm leading-relaxed text-muted" role="status">
        {done
          ? `${summary} M = met, P = partial, N = not met. Synthetic data.`
          : `Auditing ${company.name}: ${STAGES[shown].name}…`}
      </p>
    </div>
  );
}
