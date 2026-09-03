"use client";

import { useCallback } from "react";
import AppShell from "../../components/AppShell";
import ResultsStep from "../../components/steps/ResultsStep";
import { downloadReportPdf } from "../../lib/api";
import { DEMO_RESULT } from "../../lib/demo";

/**
 * Static showcase of the results view with fictional data. Used for
 * screenshots and for working on the report UI without a backend.
 */
export default function DemoPage() {
  const onDownload = useCallback(async () => {
    const blob = await downloadReportPdf(DEMO_RESULT);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cv-eval-Alex_Rivera.pdf";
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  return (
    <AppShell
      step="results"
      connection="connected"
      footer={
        <div className="mt-10 flex items-center justify-between gap-3">
          <span className="text-xs uppercase tracking-[0.18em] text-mist opacity-30">
            Back
          </span>
          <span className="rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-ink">
            New evaluation
          </span>
        </div>
      }
    >
      <ResultsStep result={DEMO_RESULT} onDownload={onDownload} />
    </AppShell>
  );
}
