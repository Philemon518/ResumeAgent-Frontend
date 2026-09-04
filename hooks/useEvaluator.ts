"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  downloadReportPdf,
  evaluateStream,
  health,
  listModels,
  listRoles,
  listStats,
} from "../lib/api";
import { reportFilename } from "../lib/reportName";
import type {
  EvaluationResult,
  ModelsInfo,
  PipelineEvent,
  PlannedStage,
  RoleEvaluation,
  RoleSummary,
  StageStatus,
} from "../lib/types";
import { DEFAULT_OPENAI_MODEL, OPENAI_TIER_MODELS } from "../lib/runtimes";
import { nextStep, prevStep, type WizardStep } from "../lib/wizard";

export type RunStatus = "" | "running" | "done" | "error";

export interface LiveStage extends PlannedStage {
  status: StageStatus;
  detail?: string | null;
  startedAt?: number;
}

function applyEvent(stages: LiveStage[], event: PipelineEvent): LiveStage[] {
  if (event.type === "plan") {
    return event.stages.map((stage) => ({ ...stage, status: "pending" as const }));
  }
  if (event.type !== "stage") return stages;
  const existing = stages.find((stage) => stage.id === event.id);
  const startedAt =
    event.status === "running"
      ? (existing?.startedAt ?? Date.now())
      : existing?.startedAt;
  const next: LiveStage = {
    id: event.id,
    label: event.label,
    status: event.status,
    detail: event.detail ?? existing?.detail,
    startedAt,
  };
  if (!existing) return [...stages, next];
  return stages.map((stage) => (stage.id === event.id ? next : stage));
}

export function useEvaluator() {
  const [roles, setRoles] = useState<RoleSummary[]>([]);
  const [models, setModels] = useState<ModelsInfo | null>(null);
  const [backendOk, setBackendOk] = useState<boolean | null>(null);
  const [resumesEvaluated, setResumesEvaluated] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [portfolioFiles, setPortfolioFiles] = useState<File[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [model, setModel] = useState(DEFAULT_OPENAI_MODEL);
  const [enrich, setEnrich] = useState(false);
  const [step, setStep] = useState<WizardStep>("upload");
  const [status, setStatus] = useState<RunStatus>("");
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [partials, setPartials] = useState<RoleEvaluation[]>([]);
  const [stages, setStages] = useState<LiveStage[]>([]);
  const [error, setError] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      for (let i = 0; i < 8; i += 1) {
        try {
          const [r, m, s] = await Promise.all([
            listRoles(),
            listModels().catch(() => null),
            listStats().catch(() => null),
          ]);
          await health().catch(() => null);
          if (!alive) return;
          setRoles(r);
          setBackendOk(true);
          if (m) setModels(m);
          if (s) setResumesEvaluated(s.resumes_evaluated);
          return;
        } catch {
          if (!alive) return;
          if (i === 7) setBackendOk(false);
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (step !== "results") return;
    let alive = true;
    listStats()
      .then((s) => {
        if (alive) setResumesEvaluated(s.resumes_evaluated);
      })
      .catch(() => {
        /* keep the last known count */
      });
    return () => {
      alive = false;
    };
  }, [step]);

  const canAdvance = useMemo(() => {
    switch (step) {
      case "upload":
        return !!file;
      case "rubric":
        return selectedRoles.length > 0;
      case "configure":
        return OPENAI_TIER_MODELS.includes(model);
      case "run":
        return status === "done";
      case "results":
        return false;
      default: {
        const _never: never = step;
        return _never;
      }
    }
  }, [step, file, selectedRoles.length, model, status]);

  const goNext = useCallback(() => {
    const nxt = nextStep(step);
    if (!nxt || !canAdvance) return;
    setStep(nxt);
  }, [step, canAdvance]);

  const goBack = useCallback(() => {
    if (status === "running") return;
    const prev = prevStep(step);
    if (prev) setStep(prev);
  }, [step, status]);

  const run = useCallback(async () => {
    if (!file || selectedRoles.length === 0) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setStatus("running");
    setError("");
    setResult(null);
    setPartials([]);
    setStages([
      {
        id: "queue",
        label: "Queue position",
        status: "running",
        detail: "Checking for an open slot…",
        startedAt: Date.now(),
      },
    ]);
    setStartedAt(Date.now());
    setStep("run");
    try {
      const final = await evaluateStream(
        {
          file,
          roles: selectedRoles,
          enrich,
          model: model || undefined,
          runtime: "openai",
          portfolio: portfolioFiles,
        },
        (event: PipelineEvent) => {
          setStages((current) => applyEvent(current, event));
          if (event.type === "partial") {
            setPartials((current) => {
              const rest = current.filter((item) => item.role !== event.evaluation.role);
              return [...rest, event.evaluation];
            });
          }
          if (event.type === "complete") setResult(event.result);
        },
        controller.signal,
      );
      if (final) {
        setResult(final);
        try {
          const s = await listStats();
          setResumesEvaluated(s.resumes_evaluated);
        } catch {
          /* keep the last known count */
        }
      }
      setStatus("done");
      setStep("results");
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      setError(e instanceof Error ? e.message : String(e));
      setStatus("error");
    }
  }, [file, selectedRoles, enrich, model, portfolioFiles]);

  const downloadPdf = useCallback(async () => {
    if (!result) return;
    const blob = await downloadReportPdf(result);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = reportFilename(result, roles);
    a.click();
    URL.revokeObjectURL(url);
  }, [result, roles]);

  return {
    roles,
    models,
    backendOk,
    resumesEvaluated,
    file,
    setFile,
    portfolioFiles,
    setPortfolioFiles,
    selectedRoles,
    setSelectedRoles,
    model,
    setModel,
    enrich,
    setEnrich,
    step,
    setStep,
    status,
    result,
    partials,
    stages,
    error,
    startedAt,
    canAdvance,
    goNext,
    goBack,
    run,
    downloadPdf,
  };
}
