import { useEffect, useState } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { apiUrl } from "@/lib/apiBase";

export type SuggestItem = {
  type: string;
  id: number | null;
  title: string;
  hint: string;
  path?: string | null;
};

export function useSearchSuggest(limit: number) {
  const [query, setQuery] = useState("");
  const debounced = useDebouncedValue(query, 200);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<SuggestItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (debounced.trim().length < 1) {
      setItems([]);
      setError(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({
      q: debounced.trim(),
      limit: String(limit),
    });
    fetch(apiUrl(`/api/green_earth/search/suggest?${params}`))
      .then(async (r) => {
        const json = await r.json().catch(() => ({}));
        if (!r.ok) {
          const backendMsg =
            typeof (json as { messenge?: string }).messenge === "string"
              ? (json as { messenge: string }).messenge
              : null;
          const err = new Error(backendMsg || `HTTP_${r.status}`);
          throw err;
        }
        return json;
      })
      .then((json) => {
        if (cancelled) return;
        const raw = json?.data;
        const list = Array.isArray(raw) ? raw : [];
        setItems(
          list.map((x: Record<string, unknown>) => ({
            type: String(x.type ?? ""),
            id: x.id != null ? Number(x.id) : null,
            title: String(x.title ?? ""),
            hint: String(x.hint ?? ""),
            path: x.path != null ? String(x.path) : null,
          }))
        );
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setItems([]);
          const msg = err instanceof Error ? err.message : "";
          const looksLikeNetwork =
            msg === "" || msg.includes("Failed to fetch") || msg.includes("NetworkError");
          const genericHttp = /^HTTP_\d+$/.test(msg);
          if (looksLikeNetwork) {
            setError(
              "Could not reach the API. Start MySQL, run Spring Boot on port 8080, and run the frontend with npm run dev (proxies /api)."
            );
          } else if (genericHttp) {
            setError(
              "The server returned an HTTP error. Check MySQL is running, the backend listens on port 8080, and you opened the site via npm run dev."
            );
          } else {
            setError(
              msg.length > 180 ? `${msg.slice(0, 180)}…` : msg || "Search failed."
            );
          }
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debounced, limit]);

  return { query, setQuery, items, loading, error, debounced };
}
