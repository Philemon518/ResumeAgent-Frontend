"use client";

import type { CategoryResult } from "../lib/types";
import { scoreBand } from "../lib/format";

interface CategoryRowProps {
  category: CategoryResult;
  expanded: boolean;
  onToggle: () => void;
}

function barTone(ratio: number): string {
  const band = scoreBand(ratio);
  switch (band) {
    case "strong":
      return "bg-emerald-400";
    case "moderate":
      return "bg-gold";
    case "weak":
      return "bg-rose-400";
    default: {
      const _never: never = band;
      return _never;
    }
  }
}

export default function CategoryRow({
  category,
  expanded,
  onToggle,
}: CategoryRowProps) {
  const ratio = category.max > 0 ? category.score / category.max : 0;
  const hasDetail = Boolean(category.evidence || category.next_bracket);
  const panelId = `evidence-${category.key}`;

  return (
    <div className="rounded-lg">
      <button
        type="button"
        onClick={onToggle}
        disabled={!hasDetail}
        aria-expanded={expanded}
        aria-controls={hasDetail ? panelId : undefined}
        className="group w-full rounded-lg px-2 py-1.5 text-left transition hover:bg-white/[0.04] disabled:cursor-default disabled:hover:bg-transparent"
      >
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="flex items-center gap-2 text-white/90">
            {hasDetail ? (
              <span
                className={`font-mono text-[10px] text-mist transition-transform ${expanded ? "rotate-90" : ""}`}
                aria-hidden
              >
                ▶
              </span>
            ) : (
              <span className="w-[10px]" aria-hidden />
            )}
            <span aria-hidden>{category.icon}</span>
            {category.label}
          </span>
          <span className="font-mono tabular-nums text-mist">
            {category.score}/{category.max}
          </span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full rounded-full ${barTone(ratio)}`}
            style={{ width: `${Math.min(100, ratio * 100)}%` }}
          />
        </div>
      </button>

      {hasDetail && expanded && (
        <div id={panelId} className="space-y-3 px-2 pb-3 pt-2">
          {category.evidence ? (
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-gold/80">
                Why this score
              </p>
              <p className="mt-1 text-xs leading-relaxed text-mist">
                {category.evidence}
              </p>
            </div>
          ) : null}
          {category.next_bracket ? (
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-emerald-400/80">
                How to reach the next band
              </p>
              <p className="mt-1 text-xs leading-relaxed text-mist">
                {category.next_bracket}
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
