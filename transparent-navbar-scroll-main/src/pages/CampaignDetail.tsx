import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, MapPin, Calendar, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = "http://localhost:8080/api/green_earth/campaign";
const DONATION_API = "http://localhost:8080/api/green_earth/donation";

export default function CampaignDetail() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState<any>(null);
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [donateAmount, setDonateAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });

  const fetchData = async () => {
    try {
      const [campRes, donRes] = await Promise.all([
        fetch(`${API_URL}/${id}`),
        fetch(DONATION_API)
      ]);
      
      const campResult = await campRes.json();
      const donResult = await donRes.json();

      setCampaign(campResult.data);
      setDonations(donResult.data || donResult || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donateAmount || isSubmitting) return;
    setIsSubmitting(true);
    setMessage({ type: '', content: '' });

    try {
      const response = await fetch(DONATION_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: parseInt(id as string),
          amount: parseFloat(donateAmount),
          donorName: donorName.trim() === "" ? "Anonymous" : donorName, // Gửi tên người nhập
          userId: null, // Bỏ user ID 1 đi (hoặc để null nếu backend cho phép ẩn danh)
          paymentMethod: "BANK_TRANSFER",
          status: "COMPLETED"
        })
      });

      if (response.ok) {
        setMessage({ type: 'success', content: 'Cảm ơn bạn đã đóng góp!' });
        setDonateAmount("");
        setDonorName(""); // Xóa trắng ô nhập tên
        await fetchData(); 
      } else {
        throw new Error("Giao dịch thất bại");
      }
    } catch (error) {
      setMessage({ type: 'error', content: 'Có lỗi xảy ra, vui lòng thử lại.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-emerald-600" /></div>;
  if (!campaign) return <div className="text-center py-20 text-slate-500 font-medium">Campaign not found.</div>;

  const totalRaised = donations
    .filter(d => Number(d.campaignId) === Number(id))
    .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

  const goal = Number(campaign.targetAmount) || 0;
  const progress = goal > 0 ? Math.min(Math.round((totalRaised / goal) * 100), 100) : 0;

  return (
    <div className="bg-slate-50 min-h-screen pb-20 text-left">
      
      {/* --- HERO SECTION ĐÃ ĐƯỢC LÀM LẠI THEO STYLE CỦA NEWSDETAIL --- */}
      <div className="bg-emerald-900 text-white pt-32 pb-24 px-4 relative overflow-hidden">
        {/* Ảnh nền được làm mờ để chữ và menu nổi bật */}
        {campaign.image && (
          <div className="absolute inset-0 opacity-20">
            <img 
              src={campaign.image} 
              alt="cover" 
              className="w-full h-full object-cover" 
            />
          </div>
        )}
        
        {/* Gradient mờ ảo đổ từ trên xuống giúp menu bên ngoài hiển thị rõ ràng */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 to-transparent"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Nút quay lại giống trang News */}
          <Link to="/campaign" className="inline-flex items-center gap-2 text-emerald-300 hover:text-white mb-6 transition-colors font-medium">
            <ArrowLeft className="w-5 h-5" /> Back to Campaigns
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
            {campaign.title}
          </h1>
          
          <div className="flex flex-wrap gap-6 text-emerald-100 border-t border-emerald-800/50 pt-5 mt-4">
            <span className="flex items-center gap-2 font-medium">
              <MapPin className="w-5 h-5 text-emerald-400" /> {campaign.location}
            </span>
            <span className="flex items-center gap-2 font-medium">
              <Calendar className="w-5 h-5 text-emerald-400" /> {new Date(campaign.startDate).toLocaleDateString('en-GB')}
            </span>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT SECTION --- */}
      {/* Thêm -mt-10 và relative z-10 để nội dung đẩy nhẹ lên đè vào phần background xanh ngọc */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10 -mt-10">
        
        {/* Left: Description */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-lg border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b pb-4">About this campaign</h2>
            
            {/* Hình ảnh minh họa chính sẽ hiển thị rõ nét ở đây thay vì bị mờ ở Header */}
            <div className="mb-10 rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                <img src={campaign.image} alt="Campaign illustration" className="w-full max-h-[400px] object-cover" />
            </div>

            <div 
              className="prose prose-emerald max-w-none text-slate-600 leading-loose break-words overflow-hidden" 
              style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
              dangerouslySetInnerHTML={{ __html: campaign.description }} 
            />
          </div>
        </div>

        {/* Right: Donation Box */}
        <div className="relative">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-emerald-100 lg:sticky lg:top-24">
            <div className="flex items-center justify-between mb-4">
               <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full uppercase tracking-wider">Progress</span>
               <span className="text-3xl font-black text-slate-900">{progress}%</span>
            </div>

            <div className="w-full h-3.5 bg-slate-100 rounded-full mb-8 overflow-hidden shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8 bg-slate-50 p-4 rounded-2xl">
              <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Raised</p>
                <p className="text-2xl font-bold text-emerald-600">${totalRaised.toLocaleString()}</p>
              </div>
              <div className="text-right border-l border-slate-200 pl-4">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Goal</p>
                <p className="text-2xl font-bold text-slate-900">${goal.toLocaleString()}</p>
              </div>
            </div>

            <form onSubmit={handleDonate} className="space-y-5 pt-2">
              <p className="text-sm font-bold text-slate-700 ml-1">Support this cause</p>
              
              {/* Ô NHẬP TÊN (MỚI THÊM) */}
              <div className="relative group">
                <input 
                  type="text"
                  placeholder="Your Name (Optional)"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-700"
                />
              </div>

              {/* Ô NHẬP TIỀN CŨ CỦA BẠN */}
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 group-focus-within:text-emerald-500 transition-colors">$</span>
                <input 
                  type="number"
                  placeholder="0.00"
                  value={donateAmount}
                  onChange={(e) => setDonateAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold text-xl"
                  required
                />
              </div>

              {message.content && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}
                >
                  {message.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                  {message.content}
                </motion.div>
              )}

              <button 
                disabled={isSubmitting}
                className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-xl shadow-emerald-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:pointer-events-none uppercase tracking-wider"
              >
                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Heart className="w-6 h-6 fill-white/20" />}
                Donate Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}