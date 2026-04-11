import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import HeroCarousel from "@/components/HeroCarousel";
import EventCard from "@/components/EventCard";
import { X, Calendar, MapPin, CheckCircle } from "lucide-react"; // Cài lucide-react nếu chưa có

const EventPage = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<any>(null); // State xem chi tiết
  const [isJoining, setIsJoining] = useState(false);

  const [params] = useSearchParams();
  const campaignId = params.get("campaignId");

  useEffect(() => {
    let url = "http://localhost:8081/api/green_earth/event"; // Thêm domain nếu cần

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

  // Hàm xử lý tham gia sự kiện
  const handleJoinEvent = async (eventId: number) => {
    if (!window.confirm("Do you want to join this event?")) return;
    
    setIsJoining(true);
    try {
      // Giả định API join sự kiện của bạn
      const res = await fetch(`http://localhost:8081/api/green_earth/event/join/${eventId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 1 }) // Giả lập user ID = 1
      });

      if (res.ok) {
        alert("Success! You have registered for this event.");
      } else {
        alert("Failed to join. Maybe you've already joined?");
      }
    } catch (err) {
      alert("Network error!");
    } finally {
      setIsJoining(false);
    }
  };

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
                <div key={item.id} className="relative group">
                   {/* Card mặc định của bạn */}
                   <EventCard event={item} />
                   
                   {/* Overlay nút View & Join khi hover (hoặc bạn có thể sửa trực tiếp trong EventCard) */}
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 rounded-xl">
                      <button 
                        onClick={() => setSelectedEvent(item)}
                        className="bg-white text-green-700 px-4 py-2 rounded-lg font-bold hover:bg-green-50"
                      >
                        View Detail
                      </button>
                      <button 
                        onClick={() => handleJoinEvent(item.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700"
                      >
                        Join Now
                      </button>
                   </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                No events found.
              </div>
            )}
          </div>
        )}
      </main>

      {/* --- MODAL CHI TIẾT SỰ KIỆN --- */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            {/* Ảnh cover trong Modal */}
            <div className="h-64 relative">
              <img 
                src={selectedEvent.image || "https://via.placeholder.com/800x400"} 
                className="w-full h-full object-cover" 
                alt={selectedEvent.title} 
              />
              <button 
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 p-2 rounded-full backdrop-blur-md transition-colors"
              >
                <X className="text-white w-6 h-6" />
              </button>
            </div>

            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">{selectedEvent.title}</h2>
              
              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center gap-2 text-green-700 font-medium">
                  <Calendar className="w-5 h-5" />
                  {new Date(selectedEvent.event_date).toLocaleDateString('en-GB')}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  {selectedEvent.location}
                </div>
              </div>

              <div className="prose max-w-none text-gray-600 mb-8 max-h-48 overflow-y-auto pr-2">
                 {/* Dùng dangerouslySetInnerHTML nếu description có chứa HTML từ Quill */}
                 <div dangerouslySetInnerHTML={{ __html: selectedEvent.description }} />
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button 
                  disabled={isJoining}
                  onClick={() => handleJoinEvent(selectedEvent.id)}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 shadow-lg shadow-green-100 transition-all active:scale-95"
                >
                  {isJoining ? "Processing..." : "Confirm Join"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventPage;