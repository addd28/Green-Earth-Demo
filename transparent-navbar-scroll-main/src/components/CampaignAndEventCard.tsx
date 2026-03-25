import { MapPin, CalendarDays, Users, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const CampaignAndEventCard = ({ campaign }: { campaign: any }) => {
  // Hàm xử lý ngày tháng từ DB (YYYY-MM-DD) sang định dạng hiển thị
  const dateObj = new Date(campaign.start_date);
  const day = dateObj.getDate().toString().padStart(2, '0');
  const monthYear = dateObj.toLocaleString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();

  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border group hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      {/* Ảnh & Overlay */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img 
          src={campaign.image} 
          alt={campaign.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-black">
          {campaign.status}
        </div>

        <h3 className="absolute bottom-4 left-4 right-4 text-white text-xl font-bold font-heading line-clamp-2 leading-tight">
          {campaign.title}
        </h3>
      </div>

      {/* Nội dung */}
      <div className="p-5 flex flex-col gap-4 flex-grow">
        <div className="flex items-start gap-4">
          {/* Lịch */}
          <div className="bg-gp-green text-white p-2 rounded-xl text-center min-w-[65px] shadow-md">
            <div className="text-2xl font-black">{day}</div>
            <div className="text-[10px] font-bold opacity-90">{monthYear}</div>
          </div>
          
          <div className="flex flex-col gap-2 flex-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={14} className="text-gp-green shrink-0" />
              <span className="line-clamp-1">{campaign.location}</span>
            </div>
            {/* Hiển thị mục tiêu ngắn gọn */}
            <div className="flex gap-3 mt-1">
               <div className="flex items-center gap-1 text-[12px] font-medium text-muted-foreground">
                  <Users size={14} /> {campaign.target_volunteers}
               </div>
               <div className="flex items-center gap-1 text-[12px] font-medium text-muted-foreground">
                  <Heart size={14} /> ${Number(campaign.target_amount).toLocaleString()}
               </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 italic">
          {campaign.description}
        </p>

        {/* Nút điều hướng vào chi tiết */}
        <div className="mt-auto pt-2">
         <Link to={`/campaignandevent/${campaign.id}`} className="block w-full"> 
            <button className="w-full border-2 border-gp-green text-gp-green px-4 py-2.5 rounded-xl text-xs font-extrabold hover:bg-gp-green hover:text-white transition-all active:scale-95 uppercase tracking-wider">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};


export default CampaignAndEventCard;