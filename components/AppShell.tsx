"use client";

import type { ReactNode } from "react";
import HintTooltip from "./HintTooltip";
import StepperRail from "./StepperRail";
import type { WizardStep } from "../lib/wizard";

interface AppShellProps {
  step: WizardStep;
  resumesEvaluated?: number | null;
  children: ReactNode;
  footer?: ReactNode;
  evaluating?: boolean;
}

function formatCount(value: number | null | undefined): string {
  if (value == null) return "—";
  return value.toLocaleString("en-US");
}

export default function AppShell({
  step,
  resumesEvaluated = null,
  children,
  footer,
  evaluating = false,
}: AppShellProps) {
  return (
    <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8 md:px-8 md:py-12">
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden
      >
        <div className={`orb orb-gold ${evaluating ? "is-active" : ""}`} />
        <div className={`orb orb-teal ${evaluating ? "is-active" : ""}`} />
      </div>

      <header className="relative z-10 mb-10 flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-gold">
            Resume Agent
          </p>
          <h1 className="mt-2 font-display text-2xl text-white md:text-3xl">
            Resume Evaluator for specific Careers
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-full border border-gold/40 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.24em] text-gold">
            Resumes Evaluated: {formatCount(resumesEvaluated)}
          </div>
          <HintTooltip
            label="Resumes Checked"
            align="right"
            panelClassName="w-72"
          >
            <p className="text-xs font-medium text-white">Resumes Checked</p>
            <p className="mt-2 text-[11px] leading-relaxed text-mist">
              The amount of times users worldwide have used resumeagent.lol to
              evaluate their resume.
            </p>
          </HintTooltip>
        </div>
      </header>

      <div className="relative z-10 grid flex-1 gap-10 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <StepperRail current={step} />
        </aside>

        <section className="relative min-h-[520px] rounded-3xl border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur-md md:p-10">
          {children}
          {footer}
        </section>
      </div>
    </div>
  );
}
