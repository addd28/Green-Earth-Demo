import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2, CreditCard, QrCode, TrendingUp, ChevronDown, ChevronUp, Calendar, MapPin, Lock } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import "../css/Donate.css";

const Donate = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialCampaignId = queryParams.get("campaignId") || "";

  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [message, setMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("QR_CODE");

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
    const fetchCampaigns = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/green_earth/campaign");
        const result = await response.json();
        const data = result.data || result;
        setCampaigns(data);
        const defaultCamp = initialCampaignId ? data.find((c: any) => c.id.toString() === initialCampaignId) : data[0];
        setSelectedCampaign(defaultCamp);
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchCampaigns();
  }, [initialCampaignId]);

  const isCompleted = () => selectedCampaign?.status === "COMPLETED";

  const handleDonateNow = () => {
    if (isCompleted()) return alert("This campaign is closed.");
    const amount = parseFloat(donationAmount);
    if (!amount || amount <= 0) return alert("Please enter a valid amount.");

    navigate('/payment', { 
      state: { amount, donorName, message, paymentMethod, campaignId: selectedCampaign?.id } 
    });
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-emerald-600" /></div>;

  return (
    <div className="donate-page">
      <section className="hero-section">
        <div className="hero-container">
          <h1 className="hero-title">Be the Change Our Planet Needs</h1>
        </div>
      </section>

      <section className="donation-section py-16 bg-white max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">1. Select Campaign</h2>
          <select 
            className="w-full p-4 border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-500 bg-slate-50 font-medium"
            value={selectedCampaign?.id}
            onChange={(e) => setSelectedCampaign(campaigns.find(c => c.id.toString() === e.target.value))}
          >
            {campaigns.map(cp => <option key={cp.id} value={cp.id}>{cp.title}</option>)}
          </select>

          {selectedCampaign && (
            <div className={`rounded-3xl border shadow-sm p-8 space-y-6 ${isCompleted() ? 'bg-slate-50 border-slate-200' : 'bg-emerald-50/50 border-emerald-100'}`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-emerald-700 font-bold uppercase text-xs tracking-widest">
                  <TrendingUp size={20} /> Progress
                </div>
                {isCompleted() && <span className="px-3 py-1 bg-slate-200 text-slate-600 rounded-full text-[10px] font-black uppercase">Finished</span>}
              </div>
              
              <div className="space-y-2">
                <span className={`text-5xl font-black ${isCompleted() ? 'text-slate-500' : 'text-emerald-600'}`}>{selectedCampaign.progressPercentage}%</span>
                <div className="w-full h-4 bg-white rounded-full border border-emerald-100 overflow-hidden">
                  <div className={`h-full transition-all duration-1000 ${isCompleted() ? 'bg-slate-400' : 'bg-emerald-500'}`} style={{ width: `${selectedCampaign.progressPercentage}%` }}></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Raised</p>
                  <p className="text-xl font-bold">${selectedCampaign.raisedAmount?.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Target</p>
                  <p className="text-xl font-bold">${selectedCampaign.targetAmount?.toLocaleString()}</p>
                </div>
              </div>

              <button onClick={() => setShowMoreInfo(!showMoreInfo)} className="flex items-center gap-2 text-sm font-bold text-emerald-700">
                {showMoreInfo ? <ChevronUp size={18} /> : <ChevronDown size={18} />} View details
              </button>

              {showMoreInfo && (
                <div className="pt-4 border-t border-emerald-100 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-600 font-medium">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-emerald-500" /> 
                      <span>Location: {selectedCampaign.location || "Global"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-emerald-500" /> 
                      <span>Deadline: {new Date(selectedCampaign.endDate).toLocaleDateString('en-GB')}</span>
                    </div>
                  </div>
                  <div 
                    className="text-sm text-slate-600 leading-relaxed italic border-l-4 border-emerald-200 pl-4" 
                    dangerouslySetInnerHTML={{ __html: selectedCampaign.description }} 
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-50 space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">2. Donation Details</h2>
          
          <div className="grid grid-cols-4 gap-3">
            {donationTiers.map(tier => (
              <button 
                key={tier.id}
                disabled={isCompleted()}
                onClick={() => setDonationAmount(tier.amount.toString())}
                className={`p-4 rounded-2xl border-2 transition-all ${donationAmount === tier.amount.toString() ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-50 bg-slate-50 hover:border-slate-200'}`}
              >
                <p className="text-xl font-black">${tier.amount}</p>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <input type="number" placeholder="Other Amount ($)" className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-emerald-500 font-bold" value={donationAmount} onChange={e => setDonationAmount(e.target.value)} />
            <input type="text" placeholder="Full Name (Optional)" className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-emerald-500" value={donorName} onChange={e => setDonorName(e.target.value)} />
            <textarea placeholder="Message" className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-emerald-500 h-24" value={message} onChange={e => setMessage(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setPaymentMethod("QR_CODE")} className={`p-4 rounded-2xl border-2 flex items-center justify-center gap-2 font-bold ${paymentMethod === "QR_CODE" ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100'}`}>
              <QrCode size={20} /> Bank Transfer
            </button>
            <button onClick={() => setPaymentMethod("CARD")} className={`p-4 rounded-2xl border-2 flex items-center justify-center gap-2 font-bold ${paymentMethod === "CARD" ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100'}`}>
              <CreditCard size={20} /> Visa / Debit
            </button>
          </div>

          <button onClick={handleDonateNow} disabled={isCompleted()} className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-xl hover:bg-emerald-700 shadow-xl transition-all disabled:bg-slate-300">
            {isCompleted() ? "Campaign Closed" : "Donate Now"}
          </button>
        </div>
      </section>

      <section className="faq-section py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12"><h2 className="text-3xl font-bold">Frequently Asked Questions</h2></div>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`} className="border bg-white rounded-2xl px-6">
                <AccordionTrigger className="font-bold text-left hover:no-underline">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-loose pb-6">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
};

export default Donate;