import { useState } from "react";

const EventCard = ({ event }: any) => {
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    const email = prompt("Nhập email của bạn:");
    if (!email) return;

    setLoading(true);

    try {
      await fetch("http://localhost:8080/api/event-participants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          eventId: event.id
        })
      });

      alert("Đăng ký thành công!");
    } catch (err) {
      alert("Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden">
      
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover hover:scale-105 transition"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-end p-4">
          <h2 className="text-white text-lg font-bold leading-tight">
            {event.title}
          </h2>
        </div>

        {/* Date Badge */}
        <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-2 rounded-lg text-center">
          <div className="text-lg font-bold">
            {new Date(event.event_date).getDate()}
          </div>
          <div className="text-xs uppercase">
            {new Date(event.event_date).toLocaleString("en-US", {
              month: "short"
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-gray-600 text-sm line-clamp-2">
          {event.description}
        </p>

        {/* Info */}
        <div className="flex justify-between text-sm text-gray-500 mt-4">
          <span>📍 {event.location}</span>
        </div>

        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>👥 {event.target_volunteers}</span>
          <span>💰 ${event.target_amount}</span>
        </div>

        {/* Button */}
        <button
          onClick={handleJoin}
          disabled={loading}
          className="mt-5 w-full bg-green-600 text-white py-2 rounded-full hover:bg-green-700 transition"
        >
          {loading ? "JOINING..." : "JOIN EVENT"}
        </button>
      </div>
    </div>
  );
};

export default EventCard;