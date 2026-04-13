import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import HeroCarousel from "@/components/HeroCarousel";
import EventCard from "@/components/EventCard";
import { Search } from "lucide-react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { unwrapListData } from "@/lib/unwrapListData";

const EventPage = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 400);

  const [params] = useSearchParams();
  const campaignId = params.get("campaignId");

  useEffect(() => {
    const sp = new URLSearchParams({ page: "0", size: "100" });
    if (campaignId) sp.set("campaignId", campaignId);
    if (debouncedQuery.trim()) sp.set("q", debouncedQuery.trim());

    setLoading(true);
    fetch(`/api/green_earth/event?${sp}`)
      .then((res) => res.json())
      .then((json) => {
        const rawList = unwrapListData<any>(json?.data);
        const formatted = rawList.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          location: item.location,
          event_date: item.eventDate,
          image: item.image,
        }));
        setEvents(formatted);
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, [campaignId, debouncedQuery]);

  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      <HeroCarousel />

      <main className="container mx-auto px-4 py-10 pt-24 lg:px-8">
        <div className="mb-12 border-b pb-6">
          <h1 className="text-4xl font-extrabold text-green-700">Events</h1>
          <p className="text-gray-600 mt-2 max-w-2xl">
            Join our upcoming environmental events and make an impact.
          </p>
          <div className="mt-6 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600/60" />
            <input
              type="search"
              placeholder="Search by name, description, location..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-green-200 bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-green-400 outline-none text-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 font-bold text-green-600">Loading events...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.length > 0 ? (
              events.map((item) => <EventCard key={item.id} event={item} />)
            ) : (
              <div className="col-span-full text-center text-gray-500">No events found.</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default EventPage;
