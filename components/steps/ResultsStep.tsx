"use client";

import type { EvaluationResult, RuntimeName } from "../../lib/types";
import { humanizeModel } from "../../lib/format";
import { parseRuntime, runtimeLabel } from "../../lib/runtimes";
import Chip, { type ChipTone } from "../Chip";
import ResultCard from "../ResultCard";

interface ResultsStepProps {
  result: EvaluationResult;
  onDownload: () => void;
}

function runtimeTone(runtime: RuntimeName): ChipTone {
  switch (runtime) {
    case "local":
      return "neutral";
    case "openai":
      return "warning";
    default: {
      const _never: never = runtime;
      return _never;
    }
  }
}

export default function ResultsStep({ result, onDownload }: ResultsStepProps) {
  const sorted = [...result.evaluations].sort((a, b) => b.overall - a.overall);
  const runtime = parseRuntime(result.runtime);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold">
            Step 05
          </p>
          <h2 className="mt-2 font-display text-3xl text-white md:text-4xl">
            {result.candidate_name || "Results"}
          </h2>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Chip tone="model" icon="◆">
              {humanizeModel(result.model)}
            </Chip>
            <Chip tone={runtimeTone(runtime)}>{runtimeLabel(runtime)}</Chip>
            <Chip tone={result.github_enriched ? "positive" : "neutral"}>
              {result.github_enriched ? "GitHub enriched" : "GitHub off"}
            </Chip>
            <Chip tone={result.portfolio_enriched ? "positive" : "neutral"}>
              {result.portfolio_enriched ? "Portfolio included" : "No portfolio"}
            </Chip>
            <Chip tone="neutral">
              {sorted.length} {sorted.length === 1 ? "rubric" : "rubrics"}
            </Chip>
          </div>
          <p className="mt-3 max-w-lg text-xs leading-relaxed text-mist">
            This report lives in this tab only. Refreshing or leaving the page
            discards it — we do not keep a copy of your CV or the PDF.
          </p>
        </div>
        <button
          type="button"
          onClick={onDownload}
          className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.16em] text-white transition hover:border-gold hover:text-gold"
        >
          Download PDF
        </button>
      </div>

      <div className="space-y-5">
        {sorted.map((ev) => (
          <ResultCard key={ev.role} ev={ev} />
        ))}
      </div>
    </div>
  );
}
