import { useEffect, useState } from "react";
import HeroCarousel from "@/components/HeroCarousel";
import CampaignAndEventCard from "@/components/CampaignAndEventCard";

const CampaignAndEventPage = () => {
  // Luôn khởi tạo là mảng rỗng để tránh lỗi .map khi chưa có dữ liệu
  const [campaignsAndEventsData, setCampaignsAndEventsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8081/api/green_earth/campaign")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        // KIỂM TRA CẤU TRÚC DỮ LIỆU:
        // Nếu API trả về trực tiếp mảng: data.map
        // Nếu API trả về object: data.data.map hoặc data.content.map
        const rawList = Array.isArray(data) ? data : (data?.data || data?.content || []);

        if (Array.isArray(rawList)) {
          const formatted = rawList.map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            location: item.location,
            start_date: item.startDate,        
            end_date: item.endDate,            
            target_volunteers: item.targetVolunteers, 
            target_amount: item.targetAmount,  
            image: item.image,
            status: item.status
          }));
          setCampaignsAndEventsData(formatted);
        } else {
          console.error("Dữ liệu trả về không đúng định dạng mảng:", data);
        }
      })
      .catch((err) => console.error("Lỗi fetch API:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <HeroCarousel />
      
      <main className="container mx-auto px-4 py-10 pt-24 lg:px-8">
        <div className="mb-12 border-b border-border pb-6">
          <h1 className="text-4xl font-extrabold font-heading text-foreground tracking-tight">
            Our Events & Campaigns
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Join our global movement. Find and participate in upcoming summits, workshops, cleanups, and actions near you.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 font-bold text-[#008a00]">Loading activities...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Sử dụng optional chaining ?. để an toàn tuyệt đối */}
            {campaignsAndEventsData?.length > 0 ? (
              campaignsAndEventsData.map((item) => (
                <CampaignAndEventCard
                  key={item.id}
                  campaign={item}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-muted-foreground">
                No campaigns or events available at the moment.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default CampaignAndEventPage;