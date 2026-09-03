/** Accept a host, http(s) URL, or relative prefix. Railway often omits https://. */
export function normalizeApiBase(raw: string | undefined): string {
  const value = (raw || "").trim();
  if (!value) return "/api";
  if (value.startsWith("/")) return value.replace(/\/$/, "") || "/api";
  const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  return withScheme.replace(/\/$/, "");
}
