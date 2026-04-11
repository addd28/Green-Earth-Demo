import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader2, ArrowRight } from "lucide-react"; // Thêm icon mũi tên

const API_CAMPAIGNS = "http://localhost:8081/api/green_earth/campaign";

const IssuesSection = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm lọc bỏ thẻ HTML từ ReactQuill để hiển thị văn bản thuần túy
  const stripHtml = (html) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch(API_CAMPAIGNS);
        const result = await response.json();
        
        // Lấy danh sách, đảo ngược để lấy bài mới nhất, và cắt lấy 3 bài
        const allCampaigns = result.data || result || [];
        const latestCampaigns = [...allCampaigns].reverse().slice(0, 3);
        
        setCampaigns(latestCampaigns);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu chiến dịch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading) {
    return (
      <section className="bg-background py-20 flex justify-center items-center">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
      </section>
    );
  }

  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* 1. SỬA TIÊU ĐỀ: Kêu gọi hành động mạnh mẽ hơn */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-5xl text-foreground mb-4">
            Join the Movement: Featured Campaigns
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Discover how you can make a real difference today. Every action counts in protecting our planet.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {campaigns.map((campaign) => (
            // 2. DÙNG <Link> để điều hướng mượt mà không bị reload trang
            <Link 
              to={`/campaign/${campaign.id}`} 
              key={campaign.id} 
              className="group block overflow-hidden h-full flex flex-col"
            >
              <div className="overflow-hidden rounded-xl shadow-sm">
                <img
                  // Nếu không có ảnh thì hiển thị ảnh mặc định ngẫu nhiên theo ID
                  src={campaign.image || `https://picsum.photos/seed/${campaign.id}/800/600`}
                  alt={campaign.title}
                  className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              
              <div className="flex-1 flex flex-col mt-5">
                <h3 className="font-heading text-2xl text-foreground group-hover:text-emerald-600 transition-colors line-clamp-2">
                  {campaign.title}
                </h3>
                
                {/* Dùng stripHtml và line-clamp-3 để cắt văn bản dài thành 3 dòng kèm dấu ... */}
                <p className="text-muted-foreground text-sm mt-3 leading-relaxed line-clamp-3 flex-1">
                  {stripHtml(campaign.description)}
                </p>
                
                {/* 3. THÊM NÚT CALL-TO-ACTION (Kêu gọi hành động) DƯỚI CÙNG */}
                <div className="mt-4 flex items-center gap-2 text-sm font-bold text-emerald-600 group-hover:text-emerald-700 transition-colors">
                  Read full story <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Thêm nút Xem tất cả để người dùng vào trang danh sách */}
        {campaigns.length > 0 && (
          <div className="mt-16 text-center">
             <Link 
               to="/campaign" 
               className="inline-block border-2 border-foreground text-foreground px-8 py-3 font-bold text-sm hover:bg-foreground hover:text-background transition-colors rounded-lg"
             >
               View All Campaigns
             </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default IssuesSection;