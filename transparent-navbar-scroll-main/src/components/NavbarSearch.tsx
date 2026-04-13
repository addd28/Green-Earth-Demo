import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Search } from "lucide-react";
import { useSearchSuggest } from "@/hooks/useSearchSuggest";
import { pathForSuggestItem, TYPE_LABEL } from "@/lib/suggestNavigation";

type NavbarSearchProps = {
  scrolled: boolean;
  className?: string;
  inputClassName?: string;
  onNavigate?: () => void;
  limit?: number;
};

export default function NavbarSearch({
  scrolled,
  className = "",
  inputClassName = "",
  onNavigate,
  limit = 10,
}: NavbarSearchProps) {
  const navigate = useNavigate();
  const { query, setQuery, items, loading, error } = useSearchSuggest(limit);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActive(0);
  }, [items]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const go = useCallback(
    (idx: number) => {
      const item = items[idx];
      if (!item) return;
      navigate(pathForSuggestItem(item));
      setQuery("");
      setOpen(false);
      onNavigate?.();
    },
    [items, navigate, onNavigate, setQuery]
  );

  const goToFullResults = useCallback(() => {
    const q = query.trim();
    if (q.length < 1) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setQuery("");
    setOpen(false);
    onNavigate?.();
  }, [query, navigate, onNavigate, setQuery]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const q = query.trim();
      if (q.length >= 1) {
        e.preventDefault();
        goToFullResults();
      }
      return;
    }
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!items.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    }
  };

  const showPanel = open && query.trim().length >= 1;

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <div className="flex items-center gap-1.5">
        <input
          type="search"
          autoComplete="off"
          placeholder="Search the site…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => query.trim().length >= 1 && setOpen(true)}
          onKeyDown={onKeyDown}
          className={`bg-transparent border-b text-sm py-1 px-2 w-40 lg:w-52 focus:outline-none transition-colors ${
            scrolled
              ? "border-foreground text-foreground placeholder:text-muted-foreground"
              : "border-primary-foreground/50 text-primary-foreground placeholder:text-primary-foreground/60"
          } ${inputClassName}`}
        />
        {loading ? (
          <Loader2
            size={16}
            className={`shrink-0 animate-spin ${scrolled ? "text-foreground" : "text-primary-foreground"}`}
          />
        ) : (
          <Search size={18} className={scrolled ? "text-foreground" : "text-primary-foreground"} />
        )}
      </div>

      {showPanel && (
        <div
          className="absolute left-0 right-0 sm:left-auto sm:right-0 top-full mt-1 w-full sm:w-[min(100vw-2rem,22rem)] rounded-lg border border-border bg-card shadow-lg z-[60] max-h-80 overflow-auto"
          role="listbox"
        >
          {error && (
            <div className="px-3 py-3 text-xs text-destructive border-b border-border/60">{error}</div>
          )}
          {loading && items.length === 0 && !error && (
            <div className="px-3 py-4 text-sm text-muted-foreground text-center">Searching…</div>
          )}
          {!loading && !error && items.length === 0 && query.trim().length >= 1 && (
            <div className="px-3 py-4 text-sm text-muted-foreground text-center">
              No matching suggestions. Try another keyword, or check the backend (port 8080) and MySQL.
            </div>
          )}
          {items.map((item, idx) => (
            <button
              key={`${item.type}-${item.path ?? item.id ?? idx}`}
              type="button"
              role="option"
              aria-selected={idx === active}
              className={`w-full text-left px-3 py-2.5 text-sm border-b border-border/60 last:border-0 hover:bg-muted/80 ${
                idx === active ? "bg-muted/80" : ""
              }`}
              onMouseEnter={() => setActive(idx)}
              onClick={() => go(idx)}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-foreground line-clamp-1">{item.title}</span>
                <span className="text-[10px] font-semibold text-gp-green shrink-0">
                  {TYPE_LABEL[item.type] ?? item.type}
                </span>
              </div>
              {item.hint ? (
                <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{item.hint}</div>
              ) : null}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
