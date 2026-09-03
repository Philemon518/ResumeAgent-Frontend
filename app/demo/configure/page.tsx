"use client";

import { useState } from "react";
import AppShell from "../../../components/AppShell";
import ConfigureStep from "../../../components/steps/ConfigureStep";
import { DEFAULT_OPENAI_MODEL } from "../../../lib/runtimes";

/** Static showcase of the Fast / Normal / High model picker. */
export default function DemoConfigurePage() {
  const [model, setModel] = useState(DEFAULT_OPENAI_MODEL);

  return (
    <AppShell
      step="configure"
      connection="connected"
      footer={
        <div className="mt-10 flex items-center justify-between gap-3">
          <span className="text-xs uppercase tracking-[0.18em] text-mist opacity-30">
            Back
          </span>
          <span className="rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-ink">
            Run evaluation
          </span>
        </div>
      }
    >
      <ConfigureStep model={model} onModel={setModel} />
    </AppShell>
  );
}
