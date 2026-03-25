import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, CalendarDays, Users, Heart, Share2, CheckCircle2, Trophy } from "lucide-react";
import { campaignsAndEventsData } from "./CampaignAndEventPage"; 
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Định nghĩa kiểu dữ liệu để tránh lỗi "Property does not exist"
interface CampaignItem {
  id: number;
  title: string;
  description: string;
  location: string;
  start_date: string;
  target_volunteers: number;
  image: string;
  status: string;
  type?: string; // Dấu ? nghĩa là có thể có hoặc không
}

const DetailPage = () => {
  const { id } = useParams();
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false); 
  
  // Ép kiểu dữ liệu cho item
  const item = campaignsAndEventsData.find((d) => String(d.id) === String(id)) as CampaignItem | undefined;

  useEffect(() => {
    const joinedActions = JSON.parse(localStorage.getItem("joined_actions") || "[]");
    if (joinedActions.includes(id)) {
      setHasJoined(true);
    }
  }, [id]);

  const handleQuickJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsJoining(true);
    setTimeout(() => {
      const joinedActions = JSON.parse(localStorage.getItem("joined_actions") || "[]");
      if (!joinedActions.includes(id)) {
        joinedActions.push(id);
        localStorage.setItem("joined_actions", JSON.stringify(joinedActions));
      }
      setIsJoining(false);
      setHasJoined(true); 
    }, 1200);
  };

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background px-4">
        <h2 className="text-2xl font-bold uppercase tracking-tight text-slate-900">404 - Content Not Found</h2>
        <p className="text-slate-500">The activity you are looking for does not exist or has been moved.</p>
        <Link to="/campaignandevent" className="bg-[#008a00] text-white px-8 py-3 rounded-xl font-bold transition-transform active:scale-95">
          Return to list
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 pt-24 font-sans text-slate-900">
      <style dangerouslySetInnerHTML={{ __html: `
        nav a, nav span, nav button, nav .lucide, nav input { color: #1a1a1a !important; }
        nav { background-color: white !important; border-bottom: 1px solid #e5e7eb; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .nav-logo { color: #008a00 !important; }
      `}} />

      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <Link to="/campaignandevent" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#008a00] transition-colors font-bold group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Events & Campaigns</span>
          </Link>
          <button className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"><Share2 size={20} /></button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="space-y-6">
              <span className="inline-block text-[#008a00] font-bold text-xs uppercase tracking-[0.2em] bg-green-50 px-4 py-1.5 rounded-full border border-green-100">
                {item.status}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] text-slate-900 tracking-tight">
                {item.title}
              </h1>
            </div>
            
            <div className="rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-100 bg-slate-100">
              <img src={item.image} alt={item.title} className="w-full h-auto object-cover max-h-[600px]" />
            </div>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">About this {item.type || 'Activity'}</h2>
              <p className="text-xl leading-relaxed text-slate-600 font-medium">{item.description}</p>
              
              <div className="mt-10 space-y-6 text-slate-600">
                <p>We are dedicated to fostering a community of environmental changemakers. In this {item.type || 'Action'}, we'll focus on tangible impacts and collaborative learning.</p>
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                  <h3 className="text-xl font-bold text-[#008a00] mb-4">What to expect:</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none pl-0">
                    <li className="flex items-start gap-2 text-sm font-semibold">✓ Expert-led orientation sessions</li>
                    <li className="flex items-start gap-2 text-sm font-semibold">✓ Hands-on work in {item.location}</li>
                    <li className="flex items-start gap-2 text-sm font-semibold">✓ Networking with local activists</li>
                    <li className="flex items-start gap-2 text-sm font-semibold">✓ All materials & equipment provided</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] sticky top-28 space-y-8 animate-in slide-in-from-right-4 duration-700">
              <h3 className="text-xl font-black text-[#008a00] uppercase tracking-tighter">Action Summary</h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-5 group">
                   <div className="bg-green-50 p-4 rounded-2xl group-hover:bg-green-100 transition-colors"><CalendarDays className="text-[#008a00]" size={24} /></div>
                   <div><p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Date</p><p className="font-bold text-slate-900">{item.start_date}</p></div>
                </div>
                <div className="flex items-center gap-5 group">
                   <div className="bg-green-50 p-4 rounded-2xl group-hover:bg-green-100 transition-colors"><MapPin className="text-[#008a00]" size={24} /></div>
                   <div><p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Location</p><p className="font-bold text-slate-900 leading-snug">{item.location}</p></div>
                </div>
                <div className="flex items-center gap-5 group">
                   <div className="bg-green-50 p-4 rounded-2xl group-hover:bg-green-100 transition-colors"><Users className="text-[#008a00]" size={24} /></div>
                   <div><p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Target</p><p className="font-bold text-slate-900">{item.target_volunteers} Volunteers</p></div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                {!hasJoined ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="w-full bg-[#008a00] text-white py-5 rounded-2xl font-black text-lg hover:bg-[#007000] transition-all active:scale-[0.98] shadow-lg shadow-green-200 uppercase tracking-widest">
                        Join the Action
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-none shadow-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-slate-900 tracking-tight">Register for Activity</DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium">Quick sign-up. No account required.</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleQuickJoin} className="space-y-4 mt-4">
                        <div className="space-y-2 text-left">
                          <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Full Name</label>
                          <input required className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 ring-green-500 outline-none font-medium text-slate-900" placeholder="Your Name" />
                        </div>
                        <div className="space-y-2 text-left">
                          <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Contact Info</label>
                          <input required type="text" className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 ring-green-500 outline-none font-medium text-slate-900" placeholder="Email or Phone" />
                        </div>
                        <button disabled={isJoining} type="submit" className="w-full bg-[#008a00] text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:brightness-110 transition disabled:opacity-50 mt-4">
                          {isJoining ? "Processing..." : "Confirm My Spot"}
                        </button>
                      </form>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <div className="bg-green-50 border-2 border-green-200 p-6 rounded-2xl text-center space-y-3 animate-in zoom-in-95 duration-500">
                    <div className="flex justify-center"><Trophy className="text-[#008a00] w-12 h-12" /></div>
                    <h4 className="text-slate-900 font-bold uppercase tracking-tight">You're on the list!</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">Thank you for joining. Check your email for event details.</p>
                    <div className="pt-2">
                      <span className="inline-flex items-center gap-1 text-[10px] bg-[#008a00] text-white px-4 py-1.5 rounded-full font-bold uppercase tracking-widest">
                        <CheckCircle2 size={12} /> Verified Participant
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <p className="text-[10px] text-center text-slate-400 font-bold uppercase leading-tight opacity-80">
                GreenEarth Community Action • 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;