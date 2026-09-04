import type { EvaluationResult } from "./types";

function filenameToken(value: string, fallback: string): string {
  const pieces: string[] = [];
  let buf = "";
  for (const char of value || "") {
    if (/[A-Za-z0-9]/.test(char)) {
      buf += char;
    } else if (buf) {
      pieces.push(buf);
      buf = "";
    }
  }
  if (buf) pieces.push(buf);
  return pieces.join("_") || fallback;
}

export function reportFilename(
  result: EvaluationResult,
  roles?: { name: string; department: string }[],
): string {
  const words = (result.candidate_name || "").trim().split(/\s+/);
  const first = filenameToken(words[0] || "", "Candidate");
  const primary = result.evaluations[0];
  let department = primary?.department || "";
  if (!department && primary?.role && roles) {
    department = roles.find((role) => role.name === primary.role)?.department || "";
  }
  const category = filenameToken(department, "General");
  return `ResumeAgent_${first}_${category}.pdf`;
}
