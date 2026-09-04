const STORAGE_KEY = "resumeagent.resumes_evaluated";

export function readStoredEvalCount(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw == null || raw === "") return null;
    const value = Number.parseInt(raw, 10);
    return Number.isFinite(value) && value >= 0 ? value : null;
  } catch {
    return null;
  }
}

export function writeStoredEvalCount(value: number): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, String(Math.max(0, value)));
  } catch {
    /* private mode */
  }
}

export function mergeEvalCount(
  previous: number | null,
  incoming: number | null | undefined,
): number | null {
  const values = [previous, incoming].filter(
    (value): value is number => value != null && Number.isFinite(value),
  );
  if (!values.length) return previous;
  return Math.max(...values);
}
