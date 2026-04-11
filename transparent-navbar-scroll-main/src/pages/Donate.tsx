import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2, CreditCard, QrCode, TrendingUp, ChevronDown, ChevronUp, Calendar, MapPin } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion, AnimatePresence } from "framer-motion"; 
import "../css/Donate.css";

const Donate = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  // initialCampaignId sẽ lấy từ URL ?campaignId=...
  const initialCampaignId = queryParams.get("campaignId") || "";

  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [message, setMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("QR_CODE");
  const [donations, setDonations] = useState<any[]>([]);

  useEffect(() => {
    const savedData = localStorage.getItem("pending_donation");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setDonationAmount(parsed.donationAmount || "");
      setDonorName(parsed.donorName || "");
      setMessage(parsed.message || "");
      setPaymentMethod(parsed.paymentMethod || "QR_CODE");
    }
  }, []);

  useEffect(() => {
    const dataToSave = { donationAmount, donorName, message, paymentMethod };
    localStorage.setItem("pending_donation", JSON.stringify(dataToSave));
  }, [donationAmount, donorName, message, paymentMethod]);

  const donationTiers = [
    { id: "tier-25", amount: 25 },
    { id: "tier-50", amount: 50 },
    { id: "tier-100", amount: 100 },
    { id: "tier-250", amount: 250 },
  ];

  const faqs = [
    { q: "Is my donation tax-deductible?", a: "Yes! GreenEarth is a registered non-profit organization." },
    { q: "How will my money be used?", a: "We invest directly into field campaigns, environmental protection initiatives, and community education." },
    { q: "Can I cancel my donation?", a: "Of course! You have complete control over your contributions and can contact us for any changes." }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [campRes, donRes] = await Promise.all([
          fetch("http://localhost:8081/api/green_earth/campaign").then(res => res.json()),
          fetch("http://localhost:8081/api/green_earth/donation").then(res => res.json())
        ]);

        const allCamps = campRes.data || campRes || [];
        const allDons = donRes.data || donRes || [];
        setDonations(allDons);

        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const ongoingCamps = allCamps.filter((cp: any) => {
          const raised = allDons.filter((d: any) => Number(d.campaignId) === Number(cp.id))
                               .reduce((sum: number, d: any) => sum + (Number(d.amount) || 0), 0);
          const goal = Number(cp.targetAmount) || 0;
          const progress = goal > 0 ? (raised / goal) * 100 : 0;
          const endDate = cp.endDate ? new Date(cp.endDate) : null;
          
          return progress < 100 && (!endDate || endDate >= now) && cp.status !== "COMPLETED";
        });

        setCampaigns(ongoingCamps);

        // --- SỬA LOGIC GIỮ CHIẾN DỊCH TẠI ĐÂY ---
        // 1. Kiểm tra nếu có initialCampaignId từ URL (Khi từ trang chi tiết hoặc thanh toán quay lại)
        // 2. Nếu không có, kiểm tra xem có selectedCampaign hiện tại trong state không (để tránh mất khi re-render)
        // 3. Cuối cùng mới lấy cái đầu tiên
        const targetId = initialCampaignId || selectedCampaign?.id?.toString();
        const foundCamp = ongoingCamps.find((c: any) => c.id.toString() === targetId);
        
        setSelectedCampaign(foundCamp || ongoingCamps[0] || null);
      } catch (error) { 
        console.error("Error fetching data:", error); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchData();
  }, [initialCampaignId]); // Phụ thuộc vào initialCampaignId từ URL

  const getProgress = () => {
    if (!selectedCampaign) return 0;
    const totalRaised = donations
      .filter(d => Number(d.campaignId) === Number(selectedCampaign.id))
      .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
    const goal = Number(selectedCampaign.targetAmount) || 1;
    return Math.min(Math.round((totalRaised / goal) * 100), 100);
  };

  const handleDonateNow = () => {
    if (!selectedCampaign) return alert("Please select an active campaign.");
    const amount = parseFloat(donationAmount);
    if (!amount || amount <= 0) return alert("Please enter a valid amount.");

    // Khi navigate đi, truyền campaignId lên URL để khi quay lại nó vẫn giữ đúng cái này
    navigate(`/payment?campaignId=${selectedCampaign.id}`, { 
      state: { amount, donorName, message, paymentMethod, campaignId: selectedCampaign?.id } 
    });
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-emerald-800" /></div>;

  return (
    <div className="donate-page bg-slate-50 min-h-screen">
      <section className="bg-emerald-900 pt-32 pb-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-extrabold text-white font-serif mb-4">
            Be the Change Our Planet Needs
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-emerald-100 max-w-2xl mx-auto text-lg">
            Your contribution supports vital environmental conservation efforts worldwide.
          </motion.p>
        </div>
      </section>

      <motion.section initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-start -mt-12 mb-20 relative z-20">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3 drop-shadow-md">
            <span className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center text-sm font-black shadow-lg">1</span>
            Select Campaign
          </h2>
          
          <select 
            className="w-full p-4 border-2 border-white rounded-2xl outline-none focus:border-emerald-600 bg-white shadow-xl font-medium transition-all"
            value={selectedCampaign?.id || ""}
            onChange={(e) => {
                const camp = campaigns.find(c => c.id.toString() === e.target.value);
                setSelectedCampaign(camp);
                // Cập nhật URL mà không load lại trang để giữ state khi user F5 hoặc quay lại
                window.history.replaceState(null, "", `?campaignId=${e.target.value}`);
            }}
          >
            {campaigns.length > 0 ? (
              campaigns.map(cp => <option key={cp.id} value={cp.id}>{cp.title}</option>)
            ) : (
              <option disabled value="">No active campaigns available</option>
            )}
          </select>

          {selectedCampaign ? (
            <div className="rounded-3xl border shadow-2xl p-8 space-y-6 bg-white transition-all duration-500 border-emerald-50">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-emerald-800 font-bold uppercase text-xs tracking-widest">
                  <TrendingUp size={20} /> Progress
                </div>
              </div>
              
              <div className="space-y-2">
                <span className="text-5xl font-black text-emerald-800">
                  {getProgress()}%
                </span>
                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-50 shadow-inner">
                  <motion.div 
                    key={selectedCampaign.id + donations.length} 
                    initial={{ width: 0 }}
                    animate={{ width: `${getProgress()}%` }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="h-full bg-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Raised</p>
                  <p className="text-2xl font-bold text-emerald-900">
                    ${(donations.filter(d => Number(d.campaignId) === Number(selectedCampaign.id)).reduce((sum, d) => sum + (Number(d.amount) || 0), 0)).toLocaleString()}
                  </p>
                </div>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Target</p>
                  <p className="text-2xl font-bold text-emerald-900">${selectedCampaign.targetAmount?.toLocaleString()}</p>
                </div>
              </div>

              <button onClick={() => setShowMoreInfo(!showMoreInfo)} className="flex items-center gap-2 text-sm font-bold text-emerald-800 hover:gap-3 transition-all">
                {showMoreInfo ? <ChevronUp size={18} /> : <ChevronDown size={18} />} View campaign details
              </button>

              <AnimatePresence>
                {showMoreInfo && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pt-4 border-t border-slate-100 space-y-4 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-600 font-medium">
                      <div className="flex items-center gap-2"><MapPin size={16} className="text-emerald-700" /><span>Location: {selectedCampaign.location || "Global"}</span></div>
                      <div className="flex items-center gap-2"><Calendar size={16} className="text-emerald-700" /><span>Deadline: {new Date(selectedCampaign.endDate).toLocaleDateString('en-GB')}</span></div>
                    </div>
                    <div className="text-sm text-slate-600 leading-relaxed italic border-l-4 border-emerald-700 pl-4 break-words" dangerouslySetInnerHTML={{ __html: selectedCampaign.description }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="p-10 bg-white rounded-3xl shadow-xl text-center text-slate-400 italic">
               We currently have no ongoing campaigns. Please check back later!
            </div>
          )}
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-50 space-y-6 lg:sticky lg:top-24">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm">2</span>
            Donation Details
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {donationTiers.map(tier => (
              <button key={tier.id} disabled={!selectedCampaign} onClick={() => setDonationAmount(tier.amount.toString())} className={`p-4 rounded-2xl border-2 transition-all duration-300 ${donationAmount === tier.amount.toString() ? 'border-emerald-700 bg-emerald-50 text-emerald-900 scale-105 shadow-md' : 'border-slate-50 bg-slate-50 hover:border-slate-200'}`}>
                <p className="text-xl font-black">${tier.amount}</p>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <input type="number" disabled={!selectedCampaign} placeholder="Other Amount ($)" className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-emerald-700 font-bold transition-all text-lg" value={donationAmount} onChange={e => setDonationAmount(e.target.value)} />
            <input type="text" disabled={!selectedCampaign} placeholder="Full Name (Optional)" className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-emerald-700 transition-all font-medium" value={donorName} onChange={e => setDonorName(e.target.value)} />
            <textarea disabled={!selectedCampaign} placeholder="Message" className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-emerald-700 h-24 transition-all font-medium" value={message} onChange={e => setMessage(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button disabled={!selectedCampaign} onClick={() => setPaymentMethod("QR_CODE")} className={`p-4 rounded-2xl border-2 flex items-center justify-center gap-2 font-bold transition-all ${paymentMethod === "QR_CODE" ? 'border-emerald-700 bg-emerald-50 text-emerald-900 shadow-sm' : 'border-slate-100 hover:bg-slate-50'}`}>
              <QrCode size={20} /> Bank Transfer
            </button>
            <button disabled={!selectedCampaign} onClick={() => setPaymentMethod("CARD")} className={`p-4 rounded-2xl border-2 flex items-center justify-center gap-2 font-bold transition-all ${paymentMethod === "CARD" ? 'border-emerald-700 bg-emerald-50 text-emerald-900 shadow-sm' : 'border-slate-100 hover:bg-slate-50'}`}>
              <CreditCard size={20} /> Visa / Debit
            </button>
          </div>

          <button onClick={handleDonateNow} disabled={!selectedCampaign} className="w-full py-5 bg-emerald-800 text-white rounded-2xl font-black text-xl hover:bg-emerald-900 shadow-xl shadow-emerald-200 transition-all active:scale-95 disabled:bg-slate-300 disabled:shadow-none mt-4">
            {selectedCampaign ? "Donate Now" : "No Active Campaign"}
          </button>
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16"><h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2><div className="w-20 h-1.5 bg-emerald-600 mx-auto rounded-full"></div></div>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`} className="border border-slate-100 bg-slate-50/30 rounded-2xl px-8 shadow-sm hover:shadow-md transition-shadow">
                <AccordionTrigger className="font-bold text-left hover:no-underline py-6 text-emerald-900 text-lg">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-loose pb-6 text-base">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </motion.section>
    </div>
  );
};

export default Donate;