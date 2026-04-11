import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import HeroCarousel from "@/components/HeroCarousel";
import EventCard from "@/components/EventCard";
import { Calendar, MapPin } from "lucide-react";

const EventPage = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [params] = useSearchParams();
  const campaignId = params.get("campaignId");

  useEffect(() => {
    let url = "http://localhost:8081/api/green_earth/event";

    if (campaignId) {
      url += `?campaignId=${campaignId}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const rawList = Array.isArray(data)
          ? data
          : data?.data || data?.content || [];

        const formatted = rawList.map((item: any) => ({
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
            Discover our upcoming environmental activities and join the movement.
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
                <div key={item.id} className="relative group overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
                   {/* Phần hình ảnh */}
                   <div className="h-56 overflow-hidden relative">
                      <img 
                        src={item.image || "https://via.placeholder.com/400x300"} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        alt={item.title} 
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-green-700 flex items-center gap-1.5 shadow-sm">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(item.event_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      </div>
                   </div>

                   {/* Phần nội dung cơ bản */}
                   <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-1 group-hover:text-green-700 transition-colors">
                        {item.title}
                      </h3>
                      
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
                        <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>

                      {/* Nút View chuyển hướng sang trang chi tiết */}
                      <button 
                        onClick={() => navigate(`/events/${item.id}`)}
                        className="w-full py-3 bg-green-50 text-green-700 rounded-xl font-bold hover:bg-green-600 hover:text-white transition-all duration-300 active:scale-[0.98]"
                      >
                        View Details
                      </button>
                   </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-10">
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