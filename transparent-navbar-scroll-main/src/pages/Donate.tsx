import { useState, useEffect } from "react"; // Thêm useEffect
import { useNavigate, useLocation } from "react-router-dom"; // Thêm useLocation
import { Check } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import "../css/Donate.css";

const Donate = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy campaignId từ URL nếu có (ví dụ: /donate?campaignId=2)
  const queryParams = new URLSearchParams(location.search);
  const initialCampaignId = queryParams.get("campaignId") || "";

  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [donationAmount, setDonationAmount] = useState("");
  const [frequency, setFrequency] = useState("Monthly");

  // MỚI: Quản lý danh sách và lựa chọn chiến dịch
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState(initialCampaignId);

  // MỚI: Lấy danh sách chiến dịch khi load trang
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/green_earth/campaign");
        const result = await response.json();
        // Giả sử API trả về { data: [...] } hoặc [...]
        const data = result.data || result;
        setCampaigns(data);
        
        // Nếu không có ID từ URL, lấy ID của chiến dịch đầu tiên làm mặc định
        if (!initialCampaignId && data.length > 0) {
          setSelectedCampaignId(data[0].id.toString());
        }
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    };
    fetchCampaigns();
  }, [initialCampaignId]);

  const donationTiers = [
    {
      id: "monthly-25",
      amount: 25,
      frequency: "Monthly",
      title: "Seedling",
      description: "Help protect local ecosystems",
      impact: "Funds research in one region",
    },
    {
      id: "monthly-50",
      amount: 50,
      frequency: "Monthly",
      title: "Advocate",
      description: "Support global campaigns",
      impact: "Funds multiple campaigns",
    },
    {
      id: "monthly-100",
      amount: 100,
      frequency: "Monthly",
      title: "Guardian",
      description: "Make a major difference",
      impact: "Supports entire initiatives",
    },
    {
      id: "monthly-250",
      amount: 250,
      frequency: "Monthly",
      title: "Protector",
      description: "Be a conservation champion",
      impact: "Leads transformative projects",
    },
  ];

  const impacts = [
    { amount: "$10", impact: "Provides one person with environmental education materials" },
    { amount: "$25", impact: "Supports one day of ocean conservation research" },
    { amount: "$50", impact: "Funds a wildlife habitat restoration project for one week" },
    { amount: "$100", impact: "Protects 100 acres of rainforest from deforestation" },
    { amount: "$250", impact: "Powers a full month of climate change advocacy campaigns" },
    { amount: "$500+", impact: "Funds an entire community environmental initiative" },
  ];

  const faqs = [
    {
      q: "Is my donation tax-deductible?",
      a: "Yes! Greenpeace is a registered nonprofit organization. Your donation is tax-deductible to the fullest extent allowed by law. You'll receive a receipt for your records.",
    },
    {
      q: "How is my donation used?",
      a: "We invest your donation directly into campaigns that create real environmental change. This includes research, direct action, legal advocacy, and community education programs around the world.",
    },
    {
      q: "Can I change my donation amount or cancel anytime?",
      a: "Absolutely! You can adjust your monthly donation or cancel at any time without penalty. You have complete control over your contribution.",
    },
    {
      q: "Is my payment information secure?",
      a: "Yes. We use industry-standard encryption and security protocols. We never share your information with third parties and comply with all data protection regulations.",
    },
    {
      q: "How often will I be charged?",
      a: "Monthly donors are charged on the same day each month. One-time donors are charged once. You'll receive a confirmation email after each transaction.",
    },
    {
      q: "Can I donate in a different currency?",
      a: "Yes! We accept donations in multiple currencies including USD, EUR, GBP, CAD, AUD, and more. The currency options will appear during checkout.",
    },
  ];

  const handleDonateNow = () => {
    const amount = parseFloat(donationAmount);
    if (!amount || amount <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }
    
    navigate('/payment', { 
      state: { 
        amount: amount, 
        frequency,
        campaignId: parseInt(selectedCampaignId) // Gửi kèm ID chiến dịch
      } 
    });
  };

  return (
    <div className="donate-page">
      <section className="hero-section">
        <div className="hero-container">
          <h1 className="hero-title">Be the Change Our Planet Needs</h1>
          <p className="hero-text">
            Your donation powers Greenpeace's global campaigns to protect our
            oceans, forests, and climate. Together, we can create a sustainable
            future for generations to come.
          </p>
        </div>
      </section>

      <section className="donation-section">
        <div className="section-container wide">
          <div className="section-heading">
            <h2 className="section-title">Choose Your Impact Level</h2>
            <p className="section-subtitle">Select a monthly commitment or make a one-time donation</p>
          </div>
          
          <div className="tiers-grid">
            {donationTiers.map((tier) => (
              <div 
                key={tier.id} 
                onClick={() => { 
                  setSelectedTier(tier.id); 
                  setDonationAmount(tier.amount.toString()); 
                  setFrequency(tier.frequency); 
                }} 
                className={`tier-card ${selectedTier === tier.id ? "tier-selected" : ""}`}
              >
                <h3 className="tier-amount">${tier.amount}</h3>
                <p className="tier-frequency">{tier.frequency}</p>
                <p className="tier-title">{tier.title}</p>
                <p className="tier-description">{tier.description}</p>
                <div className="tier-impact-box">
                  <p className="tier-impact-text">{tier.impact}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="custom-donation-box">
            <h3 className="custom-title">Select Campaign & Amount</h3>
            
            <div className="custom-form">
              {/* BỘ CHỌN CHIẾN DỊCH MỚI */}
              <select 
                className="custom-select"
                value={selectedCampaignId}
                onChange={(e) => setSelectedCampaignId(e.target.value)}
                style={{ minWidth: '200px' }}
              >
                {campaigns.map((cp) => (
                  <option key={cp.id} value={cp.id}>
                    {cp.title}
                  </option>
                ))}
              </select>

              <input 
                type="number" 
                value={donationAmount} 
                onChange={(e) => setDonationAmount(e.target.value)} 
                placeholder="Amount" 
                className="custom-input"
              />
              
              <select 
                className="custom-select" 
                value={frequency} 
                onChange={(e) => setFrequency(e.target.value)}
              >
                <option value="Monthly">Monthly</option>
                <option value="One-time">One-time</option>
              </select>

              <button className="donate-button" onClick={handleDonateNow}>
                Donate Now
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="impact-section">
        <div className="section-container wide">
          <div className="section-heading">
            <h2 className="section-title">Your Impact Matters</h2>
            <p className="section-subtitle">See what your generosity can accomplish</p>
          </div>
          <div className="impact-grid">
            {impacts.map((item, index) => (
              <div key={index} className="impact-card">
                <div className="impact-card-inner">
                  <div className="impact-icon-box">
                    <Check size={24} className="impact-icon" />
                  </div>
                  <div>
                    <p className="impact-amount">{item.amount}</p>
                    <p className="impact-text">{item.impact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="section-container">
          <div className="section-heading">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">
              Get answers to common questions about donating to Greenpeace
            </p>
          </div>
          <Accordion type="single" collapsible className="faq-accordion">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`}>
                <AccordionTrigger className="faq-question">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="faq-answer">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Ready to Make a Difference?</h2>
          <p className="cta-text">
            Join thousands of supporters creating real environmental change.
            Your donation starts today.
          </p>
          <button className="cta-button" onClick={handleDonateNow}>
            Start Your Donation
          </button>
        </div>
      </section>
    </div>
  );
};

export default Donate;