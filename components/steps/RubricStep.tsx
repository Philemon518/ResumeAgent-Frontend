"use client";

import type { RoleSummary } from "../../lib/types";
import PortfolioUpload from "../PortfolioUpload";
import RubricPicker from "../RubricPicker";

interface RubricStepProps {
  roles: RoleSummary[];
  selected: string[];
  onChange: (selected: string[]) => void;
  enrich?: boolean;
  onEnrich?: (value: boolean) => void;
  portfolioFiles?: File[];
  onPortfolioChange?: (files: File[]) => void;
}

export default function RubricStep({
  roles,
  selected,
  onChange,
  enrich = false,
  onEnrich,
  portfolioFiles = [],
  onPortfolioChange,
}: RubricStepProps) {
  const available = roles.filter((role) => !selected.includes(role.name));
  const chosen = roles.filter((role) => selected.includes(role.name));

  const add = (name: string) => {
    if (!name || selected.includes(name)) return;
    onChange([name]);
  };

  const remove = (name: string) => {
    onChange(selected.filter((item) => item !== name));
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold">
          Step 02
        </p>
        <h2 className="mt-2 font-display text-3xl text-white md:text-4xl">
          Select a rubric
        </h2>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-mist">
          Score this CV against one role. Choosing another rubric replaces the
          one you have selected.
        </p>
      </div>

      <RubricPicker available={available} onAdd={add} />

      <div className="space-y-3">
        {chosen.length === 0 && (
          <p className="rounded-xl border border-white/10 px-4 py-6 text-sm text-mist">
            No rubric selected. Add at least one to continue.
          </p>
        )}
        {chosen.map((role) => (
          <div
            key={role.name}
            className="flex items-start justify-between gap-4 rounded-xl border border-gold/20 bg-gold/5 px-4 py-4"
          >
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-gold/70">
                {role.department}
              </p>
              <p className="mt-1 font-medium text-white">{role.position_title}</p>
              <p className="mt-1 text-xs leading-relaxed text-mist">
                {role.description || role.name}
              </p>
              <p className="mt-2 font-mono text-[11px] text-gold/80">
                max {role.max_final_score} · {role.categories.length} categories
              </p>
            </div>
            <button
              type="button"
              onClick={() => remove(role.name)}
              className="shrink-0 text-xs uppercase tracking-widest text-mist transition hover:text-white"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {onEnrich ? (
        <button
          type="button"
          onClick={() => onEnrich(!enrich)}
          className={`flex w-full items-center justify-between rounded-xl border px-4 py-4 text-left transition ${
            enrich
              ? "border-gold/40 bg-gold/10"
              : "border-white/10 bg-white/[0.03] hover:border-white/20"
          }`}
        >
          <div>
            <p className="text-sm font-medium text-white">GitHub enrichment</p>
            <p className="mt-1 text-xs text-mist">
              Fetch public repositories when the CV lists a GitHub profile. Set
              GITHUB_TOKEN on the API if you enable this regularly.
            </p>
          </div>
          <span
            className={`relative h-6 w-11 rounded-full transition ${
              enrich ? "bg-gold" : "bg-white/15"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-ink transition ${
                enrich ? "left-5" : "left-0.5"
              }`}
            />
          </span>
        </button>
      ) : null}

      {onPortfolioChange ? (
        <div className="space-y-3">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-mist">
              Portfolio files
            </p>
            <p className="mt-1 text-xs leading-relaxed text-mist">
              Optional writing samples, catalogs, or images. They are scored
              with the CV.
            </p>
          </div>
          <PortfolioUpload files={portfolioFiles} onChange={onPortfolioChange} />
        </div>
      ) : null}
    </div>
  );
}
