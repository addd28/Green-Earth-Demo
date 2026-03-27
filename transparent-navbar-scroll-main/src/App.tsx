import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Index from "./pages/Index.tsx";
import Donate from "./pages/Donate.tsx";
import Payment from "./pages/Payment.tsx";
import NotFound from "./pages/NotFound.tsx";

import EventPage from "./pages/EventPage.tsx";
import CampaignList from "./pages/CampaignList.tsx";
import CampaignDetail from "./pages/CampaignDetail.tsx";
import News from "./pages/News.tsx";
import NewsDetail from "./pages/NewsDetail.tsx";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/donate" element={<Donate key={location.pathname} />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/events" element={<EventPage />} />
          <Route path="*" element={<NotFound />} />
          {/* Tuyến 1: Trang danh sách chiến dịch */}
          <Route path="/campaign" element={<CampaignList />} />
        
          {/* Tuyến 2 & 3: Trang chi tiết và Form đăng ký */}
          <Route path="/campaign/:id" element={<CampaignDetail />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsDetail />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;