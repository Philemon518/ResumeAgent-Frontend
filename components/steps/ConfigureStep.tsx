"use client";

import { OPENAI_TIERS } from "../../lib/runtimes";

interface ConfigureStepProps {
  model: string;
  onModel: (value: string) => void;
}

export default function ConfigureStep({ model, onModel }: ConfigureStepProps) {
  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold">
          Step 03
        </p>
        <h2 className="mt-2 font-display text-3xl text-white md:text-4xl">
          Choose a model
        </h2>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-mist">
          We do not collect your data, and neither does the model used for
          this evaluation. Your CV is used only to produce this evaluation.
        </p>
      </div>

      <fieldset>
        <legend className="text-xs uppercase tracking-[0.16em] text-mist">
          Speed
        </legend>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {OPENAI_TIERS.map((tier) => {
            const selected = tier.model === model;
            return (
              <button
                key={tier.model}
                type="button"
                onClick={() => onModel(tier.model)}
                className={`rounded-xl border px-3 py-3 text-left transition ${
                  selected
                    ? "border-gold/40 bg-gold/10 text-white"
                    : "border-white/10 bg-white/[0.03] text-mist hover:border-white/20 hover:text-white"
                }`}
              >
                <p className="text-sm font-medium text-white">{tier.label}</p>
                <p className="mt-1 font-mono text-[11px] text-mist">
                  {tier.model}
                </p>
              </button>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
