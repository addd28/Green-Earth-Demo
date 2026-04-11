import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, Loader2 } from "lucide-react";
import "../css/Payment.css";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Lấy dữ liệu từ trang Donate truyền sang
  const { amount, frequency, campaignId } = location.state || { 
    amount: 0, 
    frequency: "One-time", 
    campaignId: 1 
  };

  const [paymentMethod, setPaymentMethod] = useState("qr");
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });
  const [cardErrors, setCardErrors] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });

  // --- VALIDATION LOGIC ---
  const validateCardNumber = (value: string) => {
    const cleanValue = value.replace(/\s/g, "");
    return /^\d{13,19}$/.test(cleanValue) ? "" : "Card number must be 13-19 digits";
  };

  const validateExpiry = (value: string) => {
    if (!/^\d{2}\/\d{2}$/.test(value)) return "Expiry must be in MM/YY format";
    const [month, year] = value.split("/").map(v => parseInt(v, 10));
    const currentDate = new Date();
    const currentYear = parseInt(currentDate.getFullYear().toString().slice(-2));
    const currentMonth = currentDate.getMonth() + 1;
    if (month < 1 || month > 12) return "Invalid month";
    if (year < currentYear || (year === currentYear && month < currentMonth)) return "Card has expired";
    return "";
  };

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

  // --- API LOGIC: GỬI DỮ LIỆU VÀO DATABASE ---
  const handlePayment = async (methodType: string) => {
    setLoading(true);

    // Cấu trúc này phải khớp chính xác với DonationReq.java của bạn
    const donationReq = {
      userId: 1,               // Khớp với private Long userId
      campaignId: campaignId,  // Khớp với private Long campaignId
      amount: amount,          // Khớp với private BigDecimal amount
      message: `Donation via ${methodType}`, // Khớp với private String message
      paymentMethod: methodType // Khớp với private String paymentMethod (Lưu ý chữ M viết hoa)
    };

    try {
      // Kiểm tra lại port 8081 hay 8080 (XAMPP của bạn đang hiện 8080)
      const response = await fetch("http://localhost:8080/api/green_earth/donation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(donationReq),
      });

      if (response.ok) {
        alert("Success! Your donation has been recorded in the database.");
        navigate("/donate");
      } else {
        const errorData = await response.json();
        console.error("Backend Error:", errorData);
        alert("Failed to save. Server returned: " + response.status);
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Cannot connect to server. Please check if Spring Boot is running on port 8081.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        <Card className="payment-card">
          <CardHeader>
            <CardTitle className="payment-title">Complete Your Donation</CardTitle>
            <CardDescription className="payment-description">
              Amount: ${amount} ({frequency})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="payment-tabs">
              <TabsList className="payment-tabs-list">
                <TabsTrigger value="qr">Bank Transfer (QR Code)</TabsTrigger>
                <TabsTrigger value="card">Credit/Debit Card</TabsTrigger>
              </TabsList>

              {/* TAB 1: QR CODE / BANK TRANSFER */}
              <TabsContent value="qr" className="payment-tab-content">
                <div className="qr-section">
                  <QrCode size={200} className="qr-icon" />
                  <p className="qr-text">
                    Scan this QR code with your banking app to complete the transfer
                  </p>
                  <div className="account-box">
                    <p className="account-title">Account Details:</p>
                    <p>Bank: Example Bank</p>
                    <p>Account Number: 1234567890</p>
                    <p>Account Name: Greenpeace Foundation</p>
                    <p>Amount: **${amount}**</p>
                  </div>
                  <Button 
                    onClick={() => handlePayment("Bank Transfer")} 
                    className="payment-button full-width" 
                    disabled={loading}
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    I've Completed the Transfer
                  </Button>
                </div>
              </TabsContent>

              {/* TAB 2: CREDIT CARD */}
              <TabsContent value="card" className="payment-tab-content">
                <div className="form-section">
                  <div className="form-group">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.number}
                      onChange={(e) => handleCardChange("number", e.target.value)}
                    />
                    {cardErrors.number && <p className="error-text">{cardErrors.number}</p>}
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) => handleCardChange("expiry", e.target.value)}
                      />
                      {cardErrors.expiry && <p className="error-text">{cardErrors.expiry}</p>}
                    </div>
                    <div className="form-group">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={(e) => handleCardChange("cvv", e.target.value)}
                      />
                      {cardErrors.cvv && <p className="error-text">{cardErrors.cvv}</p>}
                    </div>
                  </div>
                  <div className="form-group">
                    <Label htmlFor="name">Cardholder Name</Label>
                    <Input
                      id="name"
                      placeholder="JOHN DOE"
                      value={cardDetails.name}
                      onChange={(e) => handleCardChange("name", e.target.value)}
                    />
                    {cardErrors.name && <p className="error-text">{cardErrors.name}</p>}
                  </div>
                  <Button
                    onClick={() => handlePayment("Credit Card")}
                    className="payment-button full-width"
                    disabled={loading}
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Pay ${amount}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Payment;