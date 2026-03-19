import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import IssuesSection from "@/components/IssuesSection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroCarousel />
    <IssuesSection />
    <Footer />
  </div>
);

export default Index;
