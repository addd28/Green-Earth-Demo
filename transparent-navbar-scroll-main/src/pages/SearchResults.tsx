import { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Calendar, Loader2, MapPin, Search } from "lucide-react";
import { unwrapListData } from "@/lib/unwrapListData";

const stripHtml = (html: string) => {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

export default function SearchResults() {
  const [params] = useSearchParams();
  const q = useMemo(() => (params.get("q") || "").trim(), [params]);

  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!q) {
      setCampaigns([]);
      setArticles([]);
      setEvents([]);
      setError("");
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const sp = new URLSearchParams({ page: "0", size: "100", q });

    setError("");
    Promise.allSettled([
      axios.get(`/api/green_earth/campaign?${sp}`),
      axios.get(`/api/green_earth/article?${sp}`),
      axios.get(`/api/green_earth/event?${sp}`),
    ])
      .then(([campRes, artRes, evRes]) => {
        if (cancelled) return;

        setCampaigns(campRes.status === "fulfilled" ? unwrapListData(campRes.value.data?.data) : []);
        setArticles(artRes.status === "fulfilled" ? unwrapListData(artRes.value.data?.data) : []);
        setEvents(evRes.status === "fulfilled" ? unwrapListData(evRes.value.data?.data) : []);

        if (
          campRes.status === "rejected" &&
          artRes.status === "rejected" &&
          evRes.status === "rejected"
        ) {
          setError("Khong the tai ket qua tim kiem. Hay kiem tra backend (port 8080) va thu lai.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [q]);

  const total = campaigns.length + articles.length + events.length;

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="bg-emerald-900 pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-emerald-300 hover:text-white text-sm font-medium mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
          <div className="flex items-start gap-3 text-white">
            <Search className="w-10 h-10 shrink-0 opacity-90 mt-1" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-serif">Search results</h1>
              {q ? (
                <p className="text-emerald-100 mt-2">
                  Showing matches for <span className="font-semibold text-white">&quot;{q}&quot;</span>
                </p>
              ) : (
                <p className="text-emerald-100 mt-2">Enter a term in the search bar and press Enter.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-6 relative z-10 space-y-10">
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
          </div>
        ) : !q ? null : (
          <>
            {error && (
              <div className="bg-red-50 text-red-700 rounded-2xl border border-red-200 shadow-sm p-4">
                {error}
              </div>
            )}
            {total === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center text-slate-600">
                No campaigns, articles, or events matched your search.
              </div>
            )}

            {campaigns.length > 0 && (
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <h2 className="text-lg font-bold text-slate-900 px-6 py-4 border-b border-slate-100 bg-slate-50/80">
                  Campaigns ({campaigns.length})
                </h2>
                <ul className="divide-y divide-slate-100">
                  {campaigns.map((c) => (
                    <li key={c.id}>
                      <Link
                        to={`/campaign/${c.id}`}
                        className="block px-6 py-4 hover:bg-emerald-50/60 transition-colors"
                      >
                        <p className="font-semibold text-slate-900">{c.title}</p>
                        <p className="text-sm text-slate-500 line-clamp-2 mt-1">
                          {stripHtml(c.description || "")}
                        </p>
                        {c.location ? (
                          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" /> {c.location}
                          </p>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {articles.length > 0 && (
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <h2 className="text-lg font-bold text-slate-900 px-6 py-4 border-b border-slate-100 bg-slate-50/80">
                  News &amp; stories ({articles.length})
                </h2>
                <ul className="divide-y divide-slate-100">
                  {articles.map((a) => (
                    <li key={a.id}>
                      <Link
                        to={`/news/${a.id}`}
                        className="block px-6 py-4 hover:bg-emerald-50/60 transition-colors"
                      >
                        <p className="font-semibold text-slate-900">{a.title}</p>
                        <p className="text-sm text-slate-500 line-clamp-2 mt-1">
                          {stripHtml(a.content || "")}
                        </p>
                        <div className="text-xs text-slate-400 mt-2 flex flex-wrap gap-3">
                          {a.categoryName ? <span>{a.categoryName}</span> : null}
                          {a.createdAt ? (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(a.createdAt).toLocaleDateString("en-GB")}
                            </span>
                          ) : null}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {events.length > 0 && (
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <h2 className="text-lg font-bold text-slate-900 px-6 py-4 border-b border-slate-100 bg-slate-50/80">
                  Events ({events.length})
                </h2>
                <ul className="divide-y divide-slate-100">
                  {events.map((ev) => (
                    <li key={ev.id}>
                      <Link
                        to={`/events/${ev.id}`}
                        className="block px-6 py-4 hover:bg-emerald-50/60 transition-colors"
                      >
                        <p className="font-semibold text-slate-900">{ev.title}</p>
                        <p className="text-sm text-slate-500 line-clamp-2 mt-1">
                          {stripHtml(ev.description || "")}
                        </p>
                        <div className="text-xs text-slate-400 mt-2 flex flex-wrap gap-3">
                          {ev.location ? (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" /> {ev.location}
                            </span>
                          ) : null}
                          {ev.eventDate ? (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(ev.eventDate).toLocaleDateString("en-GB")}
                            </span>
                          ) : null}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
