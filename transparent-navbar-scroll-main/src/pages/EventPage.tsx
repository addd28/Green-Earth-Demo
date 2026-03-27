import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import HeroCarousel from "@/components/HeroCarousel";
import EventCard from "@/components/EventCard";

const EventPage = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [params] = useSearchParams();
  const campaignId = params.get("campaignId");

  useEffect(() => {
  let url = "/api/green_earth/event";

  if (campaignId) {
    url += `?campaignId=${campaignId}`;
  }

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const rawList = Array.isArray(data)
        ? data
        : data?.data || data?.content || [];

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
}, [campaignId]);

  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      <HeroCarousel />

      <main className="container mx-auto px-4 py-10 pt-24 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 border-b pb-6">
          <h1 className="text-4xl font-extrabold text-green-700">
            Events
          </h1>
          <p className="text-gray-600 mt-2 max-w-2xl">
            Join our upcoming environmental events and make an impact.
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-20 font-bold text-green-600">
            Loading events...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.length > 0 ? (
              events.map((item) => (
                <EventCard key={item.id} event={item} />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                No events found.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default EventPage;