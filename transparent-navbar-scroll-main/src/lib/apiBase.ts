/**
 * Base URL for API (no trailing slash). Leave unset when using `npm run dev`:
 * Vite proxies `/api` → http://localhost:8080 (see vite.config.ts).
 * Set VITE_API_BASE_URL only when the app is served without that proxy (e.g. static host + API elsewhere).
 */
export function apiUrl(path: string): string {
  const raw = import.meta.env.VITE_API_BASE_URL as string | undefined;
  const base = typeof raw === "string" ? raw.trim() : "";
  const p = path.startsWith("/") ? path : `/${path}`;
  if (base) {
    return `${base.replace(/\/$/, "")}${p}`;
  }
  return p;
}
