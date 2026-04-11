import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, MapPin, Calendar, Loader2, CheckCircle2, ArrowLeft, QrCode, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = "http://localhost:8081/api/green_earth/campaign";
const DONATION_API = "http://localhost:8081/api/green_earth/donation";

export default function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<any>(null);
  const [donations, setDonations] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [donateAmount, setDonateAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("QR_CODE"); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [campRes, donRes] = await Promise.all([
        fetch(`${API_URL}/${id}`).then(res => res.json()),
        fetch(DONATION_API).then(res => res.json())
      ]);

      setCampaign(campRes.data || campRes);
      setDonations(donRes.data || donRes || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const getProgress = () => {
    if (!campaign || donations.length === 0) return 0;
    const totalRaised = donations
      .filter(d => Number(d.campaignId) === Number(campaign.id))
      .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
    const goal = Number(campaign.targetAmount) || 1;
    return Math.min(Math.round((totalRaised / goal) * 100), 100);
  };

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(donateAmount);
    if (!amount || amount <= 0) return alert("Please enter a valid amount.");

    // Chuyển sang trang thanh toán kèm theo dữ liệu
    navigate('/payment', { 
      state: { 
        amount, 
        donorName: donorName.trim() === "" ? "Anonymous" : donorName, 
        paymentMethod, 
        campaignId: campaign?.id 
      } 
    });
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-emerald-600" /></div>;
  if (!campaign) return <div className="text-center py-20 text-slate-500 font-medium pt-32">Campaign not found.</div>;

  const currentProgress = getProgress();
  const totalRaised = donations
    .filter(d => Number(d.campaignId) === Number(campaign.id))
    .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

  const now = new Date();
  now.setHours(0, 0, 0, 0); 
  const end = campaign.endDate ? new Date(campaign.endDate) : null;
  const isGoalReached = currentProgress >= 100;
  const isExpired = end && now > end;
  const status = (isGoalReached || isExpired) ? 'COMPLETED' : (campaign.status || 'ONGOING');

  return (
    <div className="bg-slate-50 min-h-screen pb-20 text-left">
      <div className="bg-emerald-900 text-white pt-32 pb-24 px-4 relative overflow-hidden">
        {campaign.image && (
          <div className="absolute inset-0 opacity-20">
            <img src={campaign.image} alt="cover" className={`w-full h-full object-cover ${status === 'COMPLETED' ? 'grayscale opacity-50' : ''}`} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 to-transparent"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <Link to="/campaign" className="inline-flex items-center gap-2 text-emerald-300 hover:text-white mb-6 transition-colors font-medium">
            <ArrowLeft className="w-5 h-5" /> Back to Campaigns
          </Link>
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight">{campaign.title}</h1>
            <span className={`self-start md:self-auto px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-md shadow-sm ${status === 'COMPLETED' ? 'bg-blue-500/80 text-white border-blue-400' : 'bg-emerald-500/80 text-white border-emerald-400'}`}>
              {status}
            </span>
          </div>
          <div className="flex flex-wrap gap-6 text-emerald-100 border-t border-emerald-800/50 pt-5 mt-4">
            <span className="flex items-center gap-2 font-medium"><MapPin className="w-5 h-5 text-emerald-400" /> {campaign.location}</span>
            <span className={`flex items-center gap-2 font-medium ${isExpired ? 'text-red-300' : ''}`}><Calendar className={`w-5 h-5 ${isExpired ? 'text-red-400' : 'text-emerald-400'}`} /> {new Date(campaign.startDate).toLocaleDateString('en-GB')} - {new Date(campaign.endDate).toLocaleDateString('en-GB')}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10 -mt-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-lg border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b pb-4">About this campaign</h2>
            <div className="mb-10 rounded-2xl overflow-hidden shadow-sm border border-slate-100">
              <img src={campaign.image} alt="Campaign illustration" className={`w-full max-h-[400px] object-cover ${status === 'COMPLETED' ? 'grayscale opacity-80' : ''}`} />
            </div>
            <div className="prose prose-emerald max-w-none text-slate-600 leading-loose break-words overflow-hidden" dangerouslySetInnerHTML={{ __html: campaign.description }} />
          </div>
        </div>

        <div className="relative">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-emerald-100 lg:sticky lg:top-24">
            <div className="flex items-center justify-between mb-4">
               <span className={`text-sm font-bold px-4 py-1.5 rounded-full uppercase tracking-wider ${status === 'COMPLETED' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>Progress</span>
               <span className={`text-3xl font-black ${status === 'COMPLETED' ? 'text-blue-600' : 'text-slate-900'}`}>{currentProgress}%</span>
            </div>

            <div className="w-full h-4 bg-slate-100 rounded-full mb-8 overflow-hidden shadow-inner border border-slate-50">
              <motion.div 
                key={campaign.id + donations.length} 
                initial={{ width: 0 }}
                animate={{ width: `${currentProgress}%` }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className={`h-full rounded-full ${status === 'COMPLETED' ? 'bg-blue-500' : 'bg-emerald-600'}`}
              />
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Raised</p>
                <p className={`text-2xl font-bold ${status === 'COMPLETED' ? 'text-blue-600' : 'text-emerald-600'}`}>${totalRaised.toLocaleString()}</p>
              </div>
              <div className="text-right border-l border-slate-200 pl-4">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Goal</p>
                <p className="text-2xl font-bold text-slate-900">${(campaign.targetAmount || 0).toLocaleString()}</p>
              </div>
            </div>

            {status === 'COMPLETED' ? (
              <div className="mt-2 bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-slate-100">
                  <CheckCircle2 className={`w-6 h-6 ${isGoalReached ? 'text-blue-500' : 'text-slate-400'}`} />
                </div>
                <p className="font-bold text-slate-700 uppercase tracking-widest text-sm mb-2">Campaign Closed</p>
                <p className="text-sm text-slate-500">{isGoalReached ? "Thank you! The goal has been achieved. 🎉" : "The time has expired. ⏰"}</p>
              </div>
            ) : (
              <form onSubmit={handleDonate} className="space-y-5 pt-2">
                <p className="text-sm font-bold text-slate-700 ml-1">Support this cause</p>
                <input type="text" placeholder="Your Name (Optional)" value={donorName} onChange={(e) => setDonorName(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium" />
                
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
                  <input type="number" placeholder="0.00" value={donateAmount} onChange={(e) => setDonateAmount(e.target.value)} className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold text-xl" required min="1" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setPaymentMethod("QR_CODE")} className={`p-3 rounded-xl border-2 flex items-center justify-center gap-2 text-xs font-bold transition-all ${paymentMethod === "QR_CODE" ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm' : 'border-slate-100 text-slate-500 hover:bg-slate-50'}`}>
                    <QrCode size={16} /> Bank Transfer
                  </button>
                  <button type="button" onClick={() => setPaymentMethod("CARD")} className={`p-3 rounded-xl border-2 flex items-center justify-center gap-2 text-xs font-bold transition-all ${paymentMethod === "CARD" ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm' : 'border-slate-100 text-slate-500 hover:bg-slate-50'}`}>
                    <CreditCard size={16} /> Visa / Debit
                  </button>
                </div>

                <button type="submit" className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-xl shadow-emerald-200 flex items-center justify-center gap-3">
                  <Heart className="w-6 h-6" />
                  Donate Now
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}