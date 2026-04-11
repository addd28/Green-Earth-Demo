import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, Loader2, ArrowLeft } from "lucide-react";
import "../css/Payment.css";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { amount, campaignId, donorName, message, paymentMethod: initialMethod } = location.state || { 
    amount: 0, campaignId: 1, donorName: "Anonymous", message: "", paymentMethod: "QR_CODE" 
  };

  const [activeTab, setActiveTab] = useState(initialMethod === "CARD" ? "card" : "qr");
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [cardErrors, setCardErrors] = useState({ number: "", expiry: "", cvv: "", name: "" });

  const validateCardNumber = (value: string) => /^\d{13,19}$/.test(value.replace(/\s/g, "")) ? "" : "Card number must be 13-19 digits";
  const validateExpiry = (value: string) => /^\d{2}\/\d{2}$/.test(value) ? "" : "Use MM/YY format";
  const validateCVV = (value: string) => /^\d{3,4}$/.test(value) ? "" : "CVV must be 3-4 digits";
  const validateName = (value: string) => /^[a-zA-Z\s]{2,}$/.test(value) ? "" : "Invalid name";

  const handleCardChange = (field: string, value: string) => {
    setCardDetails({ ...cardDetails, [field]: value });
    let error = "";
    if (field === "number") error = validateCardNumber(value);
    else if (field === "expiry") error = validateExpiry(value);
    else if (field === "cvv") error = validateCVV(value);
    else if (field === "name") error = validateName(value);
    setCardErrors({ ...cardErrors, [field]: error });
  };

  const handlePayment = async (type: "qr" | "card") => {
    setLoading(true);

    const finalMethodName = type === "qr" ? "Bank Transfer" : "Visa Debit Card";

    const donationReq = {
      campaignId,
      amount,
      message: message || `Donated via ${finalMethodName}`,
      paymentMethod: finalMethodName,
      donorName
    };

    try {
      const response = await fetch("http://localhost:8080/api/green_earth/donation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donationReq),
      });

      if (response.ok) {
        setTimeout(() => {
          setLoading(false);
          alert("Thank you! Donation successful.");
          localStorage.removeItem("pending_donation");
          navigate("/donate");
        }, 2000);
      } else { 
        setLoading(false);
        alert("Error: " + response.status); 
      }
    } catch (error) { 
      setLoading(false);
      alert("Server connection failed! Please check port 8080 and CORS."); 
    }
  };

  return (
    <div className="payment-page py-10">
      <div className="max-w-xl mx-auto px-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 mb-6 hover:text-emerald-600 font-bold transition-colors">
          <ArrowLeft size={20} /> Back to info
        </button>

        <Card className="shadow-2xl rounded-3xl border-none overflow-hidden">
          <CardHeader className="bg-slate-50 text-center border-b pb-8">
            <CardTitle className="text-2xl font-black text-slate-900">Finalize Donation</CardTitle>
            <CardDescription className="text-emerald-600 font-bold text-lg">
              Total: ${amount}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-8 bg-slate-100 p-1 rounded-xl">
                <TabsTrigger value="qr" className="font-bold">Bank Transfer</TabsTrigger>
                <TabsTrigger value="card" className="font-bold">Visa Card</TabsTrigger>
              </TabsList>

              <TabsContent value="qr" className="text-center space-y-6">
                <div className="inline-block p-4 bg-white border-2 border-emerald-100 rounded-2xl shadow-inner">
                  <QrCode size={180} />
                </div>
                <div className="bg-slate-50 p-4 rounded-xl text-left text-sm space-y-1 border">
                  <p><b>Bank:</b> Example Bank</p>
                  <p><b>Acc No:</b> 1234567890</p>
                  <p><b>Name:</b> Green Earth Foundation</p>
                  <p><b>Amount:</b> ${amount}</p>
                </div>
                <Button onClick={() => handlePayment("qr")} className="w-full py-6 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-100" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin mr-2" /> : "I've Completed the Transfer"}
                </Button>
              </TabsContent>

              <TabsContent value="card" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Card Number</Label>
                    <Input placeholder="1234 5678 9012 3456" value={cardDetails.number} onChange={(e) => handleCardChange("number", e.target.value)} className="py-5" />
                    {cardErrors.number && <p className="text-red-500 text-xs mt-1">{cardErrors.number}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Expiry</Label>
                      <Input placeholder="MM/YY" value={cardDetails.expiry} onChange={(e) => handleCardChange("expiry", e.target.value)} className="py-5" />
                    </div>
                    <div className="space-y-2">
                      <Label>CVV</Label>
                      <Input placeholder="***" value={cardDetails.cvv} onChange={(e) => handleCardChange("cvv", e.target.value)} className="py-5" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Cardholder Name</Label>
                    <Input placeholder="JOHN DOE" value={cardDetails.name} onChange={(e) => handleCardChange("name", e.target.value)} className="py-5" />
                  </div>
                </div>
                <Button onClick={() => handlePayment("card")} className="w-full py-6 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-100" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin mr-2" /> : `Pay $${amount}`}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Payment;