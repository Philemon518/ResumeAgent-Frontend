export type RuntimeName = "local" | "openai";

export interface RuntimeCatalog {
  label: string;
  default: string;
  models: string[];
  requires_key?: boolean;
  key_help?: string | null;
}

export const RUNTIME_ORDER: RuntimeName[] = ["local", "openai"];

const FALLBACK: Record<RuntimeName, RuntimeCatalog> = {
  local: {
    label: "Local Ollama",
    default: "gemma4:latest",
    models: [],
    requires_key: false,
    key_help: null,
  },
  openai: {
    label: "OpenAI",
    default: "gpt-4.1-mini",
    models: ["gpt-4.1-mini", "gpt-4o", "gpt-5.4"],
    requires_key: true,
    key_help: "https://platform.openai.com/api-keys",
  },
};

export const OPENAI_TIERS = [
  { label: "Fast", model: "gpt-4.1-mini" },
  { label: "Normal", model: "gpt-4o" },
  { label: "High", model: "gpt-5.4" },
] as const;

export const DEFAULT_OPENAI_MODEL = "gpt-4.1-mini";

export const OPENAI_TIER_MODELS: readonly string[] = OPENAI_TIERS.map(
  (tier) => tier.model,
);

export function isRuntimeName(value: string): value is RuntimeName {
  return value === "local" || value === "openai";
}

export function parseRuntime(value: string | undefined | null): RuntimeName {
  if (value && isRuntimeName(value)) return value;
  return "local";
}

export function isCloudRuntime(runtime: RuntimeName): boolean {
  switch (runtime) {
    case "local":
      return false;
    case "openai":
      return true;
    default: {
      const _never: never = runtime;
      return _never;
    }
  }
}

export function runtimeLabel(runtime: RuntimeName): string {
  switch (runtime) {
    case "local":
      return "Local Ollama";
    case "openai":
      return "OpenAI";
    default: {
      const _never: never = runtime;
      return _never;
    }
  }
}

export function catalogFor(
  runtimes: Record<string, RuntimeCatalog> | undefined,
  runtime: RuntimeName,
): RuntimeCatalog {
  return runtimes?.[runtime] ?? FALLBACK[runtime];
}

export function modelsForRuntime(
  runtimes: Record<string, RuntimeCatalog> | undefined,
  runtime: RuntimeName,
  available: string[] | undefined,
): string[] {
  const catalog = catalogFor(runtimes, runtime);
  if (runtime === "local" && catalog.models.length === 0) {
    return available ?? [];
  }
  return catalog.models;
}

export function defaultForRuntime(
  runtimes: Record<string, RuntimeCatalog> | undefined,
  runtime: RuntimeName,
  available: string[] | undefined,
): string {
  const models = modelsForRuntime(runtimes, runtime, available);
  const preferred = catalogFor(runtimes, runtime).default;
  if (preferred && models.includes(preferred)) return preferred;
  return models[0] ?? "";
}
