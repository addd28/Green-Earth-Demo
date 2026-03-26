import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, CalendarDays, Users, Share2, CheckCircle2, Trophy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CampaignItem {
  id: number;
  title: string;
  description: string;
  location: string;
  start_date: string;
  target_volunteers: number;
  image: string;
  status: string;
  type?: string; 
}

const DetailPage = () => {
  const { id } = useParams();
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false); 
  const [item, setItem] = useState<CampaignItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await fetch(`http://localhost:8081/api/green_earth/campaign`);
        if (response.ok) {
          const resData = await response.json();
          
          // XỬ LÝ LỖI .find(): Kiểm tra xem data nằm ở đâu
          const actualList = Array.isArray(resData) ? resData : (resData?.data || resData?.content || []);
          
          if (Array.isArray(actualList)) {
            const found = actualList.find((d: any) => String(d.id) === String(id));
            if (found) {
              // Map lại các field cho khớp với interface nếu cần
              setItem({
                ...found,
                start_date: found.startDate || found.start_date,
                target_volunteers: found.targetVolunteers || found.target_volunteers
              });
            }
          }
        }
      } catch (error) {
        console.error("Lỗi fetch chi tiết:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();

    // Sửa lỗi parse JSON an toàn cho LocalStorage
    try {
      const raw = localStorage.getItem("joined_actions");
      if (raw && raw !== "undefined") {
        const joinedActions = JSON.parse(raw);
        if (Array.isArray(joinedActions) && joinedActions.includes(id)) {
          setHasJoined(true);
        }
      }
    } catch (e) {
      console.error("Lỗi LocalStorage:", e);
    }
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-[#008a00]">Loading details...</div>;

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background px-4">
        <h2 className="text-2xl font-bold uppercase tracking-tight text-slate-900">404 - Content Not Found</h2>
        <p className="text-slate-500">The activity you are looking for does not exist.</p>
        <Link to="/campaignandevent" className="bg-[#008a00] text-white px-8 py-3 rounded-xl font-bold">
          Return to list
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 pt-24 font-sans text-slate-900">
      <style dangerouslySetInnerHTML={{ __html: `
        nav a, nav span, nav button, nav .lucide, nav input { color: #1a1a1a !important; }
        nav { background-color: white !important; border-bottom: 1px solid #e5e7eb; }
        .nav-logo { color: #008a00 !important; }
      `}} />

      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <Link to="/campaignandevent" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#008a00] font-bold group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Events & Campaigns</span>
          </Link>
          <button className="p-2 rounded-full hover:bg-slate-100 text-slate-400"><Share2 size={20} /></button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* CỘT TRÁI */}
          <div className="lg:col-span-2 space-y-8 animate-in fade-in duration-700">
            <div className="space-y-6">
              <span className="inline-block text-[#008a00] font-bold text-xs uppercase tracking-widest bg-green-50 px-4 py-1.5 rounded-full border border-green-100">
                {item.status}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-slate-900 tracking-tight">
                {item.title}
              </h1>
            </div>
            
            <div className="rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-100 bg-slate-100">
              <img src={item.image} alt={item.title} className="w-full h-auto object-cover max-h-[600px]" />
            </div>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">About this Activity</h2>
              <p className="text-xl leading-relaxed text-slate-600 font-medium">{item.description}</p>
            </div>
          </div>

          {/* CỘT PHẢI (Sidebar) */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-lg sticky top-28 space-y-8">
              <h3 className="text-xl font-black text-[#008a00] uppercase tracking-tighter">Action Summary</h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-5">
                   <div className="bg-green-50 p-4 rounded-2xl"><CalendarDays className="text-[#008a00]" size={24} /></div>
                   <div><p className="text-[10px] text-slate-400 uppercase font-black">Date</p><p className="font-bold">{item.start_date}</p></div>
                </div>
                <div className="flex items-center gap-5">
                   <div className="bg-green-50 p-4 rounded-2xl"><MapPin className="text-[#008a00]" size={24} /></div>
                   <div><p className="text-[10px] text-slate-400 uppercase font-black">Location</p><p className="font-bold leading-snug">{item.location}</p></div>
                </div>
                <div className="flex items-center gap-5">
                   <div className="bg-green-50 p-4 rounded-2xl"><Users className="text-[#008a00]" size={24} /></div>
                   <div><p className="text-[10px] text-slate-400 uppercase font-black">Target</p><p className="font-bold">{item.target_volunteers} Volunteers</p></div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                {!hasJoined ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="w-full bg-[#008a00] text-white py-5 rounded-2xl font-black text-lg hover:bg-[#007000] shadow-lg uppercase tracking-widest">
                        Join the Action
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Register</DialogTitle>
                        <DialogDescription>Quick sign-up. No account required.</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        setIsJoining(true);
                        setTimeout(() => {
                          const raw = localStorage.getItem("joined_actions");
                          const list = raw ? JSON.parse(raw) : [];
                          if (!list.includes(id)) list.push(id);
                          localStorage.setItem("joined_actions", JSON.stringify(list));
                          setIsJoining(false);
                          setHasJoined(true);
                        }, 1000);
                      }} className="space-y-4 mt-4">
                        <input required className="w-full p-4 rounded-xl border bg-slate-50" placeholder="Your Name" />
                        <input required className="w-full p-4 rounded-xl border bg-slate-50" placeholder="Email or Phone" />
                        <button disabled={isJoining} className="w-full bg-[#008a00] text-white py-4 rounded-xl font-bold uppercase disabled:opacity-50">
                          {isJoining ? "Processing..." : "Confirm My Spot"}
                        </button>
                      </form>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <div className="bg-green-50 border-2 border-green-200 p-6 rounded-2xl text-center space-y-3">
                    <Trophy className="text-[#008a00] w-12 h-12 mx-auto" />
                    <h4 className="text-slate-900 font-bold uppercase">You're on the list!</h4>
                    <span className="inline-flex items-center gap-1 text-[10px] bg-[#008a00] text-white px-4 py-1.5 rounded-full font-bold uppercase">
                      <CheckCircle2 size={12} /> Verified Participant
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;