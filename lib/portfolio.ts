export const PORTFOLIO_MAX_FILES = 4;
export const PORTFOLIO_MAX_BYTES = 5 * 1024 * 1024;

const PORTFOLIO_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png"];

export function isPortfolioFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return PORTFOLIO_EXTENSIONS.some((ext) => name.endsWith(ext));
}

export function mergePortfolioFiles(
  current: File[],
  incoming: File[],
): { files: File[]; error: string } {
  const next = [...current];
  for (const file of incoming) {
    if (!isPortfolioFile(file)) {
      return {
        files: current,
        error: `${file.name} is not a PDF, JPG, or PNG.`,
      };
    }
    if (file.size > PORTFOLIO_MAX_BYTES) {
      return {
        files: current,
        error: `${file.name} exceeds the 5 MB limit.`,
      };
    }
    if (next.some((existing) => existing.name === file.name && existing.size === file.size)) {
      continue;
    }
    if (next.length >= PORTFOLIO_MAX_FILES) {
      return {
        files: current,
        error: `At most ${PORTFOLIO_MAX_FILES} portfolio files.`,
      };
    }
    next.push(file);
  }
  return { files: next, error: "" };
}
