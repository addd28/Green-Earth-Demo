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
  const { amount, frequency } = location.state || {amount: 0,frequency: "One-time"};
  const [paymentMethod, setPaymentMethod] = useState("qr");
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
  const [loading, setLoading] = useState(false);

  const validateCardNumber = (value: string) => {
    const cleanValue = value.replace(/\s/g, "");
    if (!/^\d{13,19}$/.test(cleanValue)) {
      return "Card number must be 13-19 digits";
    }
    return "";
  };

  const validateExpiry = (value: string) => {
    if (!/^\d{2}\/\d{2}$/.test(value)) {
      return "Expiry must be in MM/YY format";
    }
    const [month, year] = value.split("/");
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt("20" + year, 10);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    if (monthNum < 1 || monthNum > 12) {
      return "Invalid month";
    }
    if (
      yearNum < currentYear ||
      (yearNum === currentYear && monthNum < currentMonth)
    ) {
      return "Card has expired";
    }
    return "";
  };

  const validateCVV = (value: string) => {
    if (!/^\d{3,4}$/.test(value)) {
      return "CVV must be 3-4 digits";
    }
    return "";
  };

  const validateName = (value: string) => {
    if (!/^[a-zA-Z\s]+$/.test(value) || value.trim().length < 2) {
      return "Name must contain only letters and be at least 2 characters";
    }
    return "";
  };

  const handleCardChange = (field: string, value: string) => {
    setCardDetails({ ...cardDetails, [field]: value });

    let error = "";
    switch (field) {
      case "number":
        error = validateCardNumber(value);
        break;
      case "expiry":
        error = validateExpiry(value);
        break;
      case "cvv":
        error = validateCVV(value);
        break;
      case "name":
        error = validateName(value);
        break;
    }

    setCardErrors({ ...cardErrors, [field]: error });
  };

  const handleCardPayment = () => {
    const hasErrors = Object.values(cardErrors).some((error) => error !== "");
    const hasEmpty = Object.values(cardDetails).some(
      (value) => value.trim() === ""
    );

    if (hasEmpty || hasErrors) {
      alert("Please fill in all card details correctly.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const success = Math.random() > 0.3;

      if (success) {
        alert("Payment processed successfully!");
        navigate("/donate");
      } else {
        alert("Please donate the money first.");
        navigate("/donate");
      }
    }, 2000);
  };

  const handleQRPayment = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert("Payment completed successfully via QR code!");
      navigate("/donate");
    }, 2000);
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        <Card className="payment-card">
          <CardHeader>
            <CardTitle className="payment-title">Complete Your Donation</CardTitle>
            <CardDescription className="payment-description">Amount: ${amount} ({frequency})</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="payment-tabs">
              <TabsList className="payment-tabs-list">
                <TabsTrigger value="qr">Bank Transfer (QR Code)</TabsTrigger>
                <TabsTrigger value="card">Credit/Debit Card</TabsTrigger>
              </TabsList>
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
                    <p>Amount: ${amount}</p>
                  </div>
                  <Button onClick={handleQRPayment} className="payment-button full-width" disabled={loading}>
                    {loading ? (
                      <Loader2 className="button-spinner" />
                    ) : null}
                    I&apos;ve Completed the Transfer
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="card" className="payment-tab-content">
                <div className="form-section">
                  <div className="form-group">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.number}
                      onChange={(e) =>
                        handleCardChange("number", e.target.value)
                      }
                    />
                    {cardErrors.number && (
                      <p className="error-text">{cardErrors.number}</p>
                    )}
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) =>
                          handleCardChange("expiry", e.target.value)
                        }
                      />
                      {cardErrors.expiry && (
                        <p className="error-text">{cardErrors.expiry}</p>
                      )}
                    </div>
                    <div className="form-group">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={(e) =>
                          handleCardChange("cvv", e.target.value)
                        }
                      />
                      {cardErrors.cvv && (
                        <p className="error-text">{cardErrors.cvv}</p>
                      )}
                    </div>
                  </div>
                  <div className="form-group">
                    <Label htmlFor="name">Cardholder Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={cardDetails.name}
                      onChange={(e) =>
                        handleCardChange("name", e.target.value)
                      }
                    />
                    {cardErrors.name && (
                      <p className="error-text">{cardErrors.name}</p>
                    )}
                  </div>
                  <Button
                    onClick={handleCardPayment}
                    className="payment-button full-width"
                    disabled={
                      loading ||
                      Object.values(cardErrors).some((e) => e) ||
                      Object.values(cardDetails).some((v) => !v.trim())
                    }
                  >
                    {loading ? <Loader2 className="button-spinner" /> : null}
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